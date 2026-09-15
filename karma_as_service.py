# v0.3.0
# { "Depends": "py-genlayer:5jycge4q8k23462jtb0b9fyey1s9qz928sz2nbrd9mg4sxqg2qng" }

import genlayer as gl
from genlayer.types import *
from genlayer.storage import TreeMap
import json
from datetime import datetime, timezone


class AggregatedKarmaRegistry(gl.contract.Contract):
    platform_scores: TreeMap[str, u256]
    platform_scores_timestamp: TreeMap[str, u256]

    total_scores: TreeMap[str, u256]
    total_scores_timestamp: TreeMap[str, u256]
    platform_count: TreeMap[str, u256]
    last_activity_timestamp: TreeMap[str, u256]

    category_activity: TreeMap[str, u256]
    category_contribution: TreeMap[str, u256]
    category_community: TreeMap[str, u256]
    category_on_chain: TreeMap[str, u256]

    history_timestamps: TreeMap[str, u256]
    history_scores: TreeMap[str, u256]
    history_count: TreeMap[str, u256]

    appeal_status: TreeMap[str, str]
    appeal_reason: TreeMap[str, str]
    appeal_initiator: TreeMap[str, str]
    appeal_timestamp: TreeMap[str, u256]

    decay_enabled: bool
    decay_per_day_inactive: u256
    decay_threshold_days: u256
    score_expiry_seconds: u256

    weight_github: u256
    weight_reddit: u256
    weight_discord: u256
    weight_twitter: u256
    weight_on_chain: u256
    weight_linkedin: u256

    # ---------- ACCESS CONTROL ----------
    # `owner` is the deployer. `validators` is the set of addresses allowed
    # to write scores / resolve appeals -- previously `set_score` and
    # `resolve_appeal` had NO authorization check at all, so anyone could
    # set anyone's karma to anything. This closes that gap.
    owner: str
    validators: TreeMap[str, bool]

    def __init__(self):
        self.decay_enabled = True
        self.decay_per_day_inactive = u256(1)
        self.decay_threshold_days = u256(30)
        self.score_expiry_seconds = u256(604800)
        self.weight_github = u256(25)
        self.weight_reddit = u256(20)
        self.weight_discord = u256(15)
        self.weight_twitter = u256(20)
        self.weight_on_chain = u256(15)
        self.weight_linkedin = u256(5)

        self.owner = str(gl.message.sender_address)
        self.validators[self.owner] = True

    def _now(self) -> u256:
        return u256(int(datetime.now(timezone.utc).timestamp()))

    def _caller_str(self) -> str:
        return str(gl.message.sender_address)

    def _platform_key(self, user: str, platform: str) -> str:
        return f"{user}:{platform.lower()}"

    def _is_validator(self) -> bool:
        caller = self._caller_str()
        if caller == self.owner:
            return True
        return self.validators.get(caller, False)

    def _require_validator(self):
        if not self._is_validator():
            raise Exception("Not authorized: caller is not a registered validator")

    def _require_owner(self):
        if self._caller_str() != self.owner:
            raise Exception("Not authorized: caller is not the contract owner")

    # ---------- VALIDATOR MANAGEMENT ----------

    @gl.public.write
    def add_validator(self, address: str) -> None:
        self._require_owner()
        self.validators[address] = True

    @gl.public.write
    def remove_validator(self, address: str) -> None:
        self._require_owner()
        if address == self.owner:
            raise Exception("Cannot remove the owner as a validator")
        self.validators[address] = False

    @gl.public.view
    def is_validator(self, address: str) -> bool:
        if address == self.owner:
            return True
        return self.validators.get(address, False)

    @gl.public.view
    def get_owner(self) -> str:
        return self.owner

    def _update_total_karma_with_categories(self, user: str):
        github = int(self.platform_scores.get(f"{user}:github", u256(0)))
        reddit = int(self.platform_scores.get(f"{user}:reddit", u256(0)))
        discord = int(self.platform_scores.get(f"{user}:discord", u256(0)))
        twitter = int(self.platform_scores.get(f"{user}:twitter", u256(0)))
        on_chain = int(self.platform_scores.get(f"{user}:on_chain", u256(0)))
        linkedin = int(self.platform_scores.get(f"{user}:linkedin", u256(0)))

        activity_avg = twitter if twitter > 0 else 0
        contribution_total = github + linkedin
        contribution_count = (1 if github > 0 else 0) + (1 if linkedin > 0 else 0)
        contribution_avg = (
            contribution_total // contribution_count if contribution_count > 0 else 0
        )
        community_total = reddit + discord
        community_count = (1 if reddit > 0 else 0) + (1 if discord > 0 else 0)
        community_avg = community_total // community_count if community_count > 0 else 0
        on_chain_avg = on_chain if on_chain > 0 else 0

        self.category_activity[user] = u256(activity_avg)
        self.category_contribution[user] = u256(contribution_avg)
        self.category_community[user] = u256(community_avg)
        self.category_on_chain[user] = u256(on_chain_avg)

        total_categories = (
            activity_avg + contribution_avg + community_avg + on_chain_avg
        )
        count_categories = (
            (1 if activity_avg > 0 else 0)
            + (1 if contribution_avg > 0 else 0)
            + (1 if community_avg > 0 else 0)
            + (1 if on_chain_avg > 0 else 0)
        )
        weighted_total = (
            total_categories // count_categories if count_categories > 0 else 0
        )

        if self.decay_enabled:
            decay_amount = self._calculate_decay(user)
            weighted_total = (
                weighted_total - decay_amount if weighted_total > decay_amount else 0
            )

        platform_count = 0
        if github > 0:
            platform_count += 1
        if reddit > 0:
            platform_count += 1
        if discord > 0:
            platform_count += 1
        if twitter > 0:
            platform_count += 1
        if on_chain > 0:
            platform_count += 1
        if linkedin > 0:
            platform_count += 1

        self.total_scores[user] = u256(weighted_total)
        self.total_scores_timestamp[user] = self._now()
        self.platform_count[user] = u256(platform_count)

    def _calculate_decay(self, user: str) -> int:
        if user not in self.last_activity_timestamp:
            return 0
        last_activity = int(self.last_activity_timestamp[user])
        days_inactive = (int(self._now()) - last_activity) // 86400
        threshold = int(self.decay_threshold_days)
        if days_inactive > threshold:
            return (days_inactive - threshold) * int(self.decay_per_day_inactive)
        return 0

    def _save_to_history(self, user: str):
        current_total = self.total_scores.get(user, u256(0))
        current_time = self._now()
        current_count = int(self.history_count.get(user, u256(0)))

        if current_count >= 10:
            for i in range(9):
                old_key = f"{user}:{i}"
                new_key = f"{user}:{i + 1}"
                if old_key in self.history_scores:
                    self.history_scores[new_key] = self.history_scores[old_key]
                    self.history_timestamps[new_key] = self.history_timestamps[old_key]
            self.history_scores[f"{user}:9"] = current_total
            self.history_timestamps[f"{user}:9"] = current_time
        else:
            self.history_scores[f"{user}:{current_count}"] = current_total
            self.history_timestamps[f"{user}:{current_count}"] = current_time
            self.history_count[user] = u256(current_count + 1)

    @gl.public.write
    def set_score(self, user: str, platform: str, score: u256) -> None:
        self._require_validator()
        if score > u256(100):
            raise Exception("Score must be 0-100")
        key = self._platform_key(user, platform)
        self.platform_scores[key] = score
        self.platform_scores_timestamp[key] = self._now()
        self.last_activity_timestamp[user] = self._now()
        self._update_total_karma_with_categories(user)
        self._save_to_history(user)

    @gl.public.view
    def get_score(self, user: str, platform: str) -> u256:
        return self.platform_scores.get(self._platform_key(user, platform), u256(0))

    @gl.public.view
    def get_github(self, user: str) -> u256:
        return self.platform_scores.get(f"{user}:github", u256(0))

    @gl.public.view
    def get_reddit(self, user: str) -> u256:
        return self.platform_scores.get(f"{user}:reddit", u256(0))

    @gl.public.view
    def get_discord(self, user: str) -> u256:
        return self.platform_scores.get(f"{user}:discord", u256(0))

    @gl.public.view
    def get_twitter(self, user: str) -> u256:
        return self.platform_scores.get(f"{user}:twitter", u256(0))

    @gl.public.view
    def get_on_chain(self, user: str) -> u256:
        return self.platform_scores.get(f"{user}:on_chain", u256(0))

    @gl.public.view
    def get_linkedin(self, user: str) -> u256:
        return self.platform_scores.get(f"{user}:linkedin", u256(0))

    @gl.public.view
    def get_total_karma(self, user: str) -> u256:
        return self.total_scores.get(user, u256(0))

    @gl.public.view
    def get_karma_with_metadata(self, user: str) -> str:
        total_score = self.total_scores.get(user, u256(0))
        timestamp = self.total_scores_timestamp.get(user, u256(0))
        p_count = self.platform_count.get(user, u256(0))
        age_seconds = int(self._now()) - int(timestamp) if timestamp > u256(0) else 0
        decay_amount = self._calculate_decay(user)
        return json.dumps(
            {
                "total_score": int(total_score),
                "timestamp": int(timestamp),
                "platform_count": int(p_count),
                "is_stale": age_seconds > int(self.score_expiry_seconds),
                "age_seconds": age_seconds,
                "decay_applied": decay_amount > 0,
                "decay_amount": decay_amount,
            },
            sort_keys=True,
        )

    @gl.public.view
    def get_category_breakdown(self, user: str) -> str:
        return json.dumps(
            {
                "activity": int(self.category_activity.get(user, u256(0))),
                "contribution": int(self.category_contribution.get(user, u256(0))),
                "community": int(self.category_community.get(user, u256(0))),
                "on_chain": int(self.category_on_chain.get(user, u256(0))),
            },
            sort_keys=True,
        )

    @gl.public.view
    def get_all_platform_scores(self, user: str) -> str:
        return json.dumps(
            {
                "github": int(self.platform_scores.get(f"{user}:github", u256(0))),
                "reddit": int(self.platform_scores.get(f"{user}:reddit", u256(0))),
                "discord": int(self.platform_scores.get(f"{user}:discord", u256(0))),
                "twitter": int(self.platform_scores.get(f"{user}:twitter", u256(0))),
                "on_chain": int(self.platform_scores.get(f"{user}:on_chain", u256(0))),
                "linkedin": int(self.platform_scores.get(f"{user}:linkedin", u256(0))),
            },
            sort_keys=True,
        )

    @gl.public.view
    def get_history(self, user: str) -> str:
        count = int(self.history_count.get(user, u256(0)))
        entries = []
        for i in range(count):
            key = f"{user}:{i}"
            entries.append(
                {
                    "index": i,
                    "score": int(self.history_scores.get(key, u256(0))),
                    "timestamp": int(self.history_timestamps.get(key, u256(0))),
                }
            )
        return json.dumps({"count": count, "entries": entries}, sort_keys=True)

    @gl.public.write
    def appeal_score(self, user: str, platform: str, reason: str) -> None:
        # Deliberately left permissionless: `user` is an off-chain handle
        # (e.g. a GitHub username), not a wallet address, so there's no
        # cheap on-chain way to verify the caller *is* that handle without
        # a separate signature/attestation flow. Filing an appeal only
        # flags a review -- it can't mutate a score by itself, since
        # resolve_appeal (below) is validator-gated. If you add
        # handle-ownership verification later, tighten this to check it.
        key = self._platform_key(user, platform)
        if int(self.platform_scores.get(key, u256(0))) == 0:
            raise Exception(f"No {platform.lower()} score found")
        if self.appeal_status.get(key, "NONE") == "PENDING":
            raise Exception("Appeal already pending")
        self.appeal_status[key] = "PENDING"
        self.appeal_reason[key] = reason
        self.appeal_initiator[key] = self._caller_str()
        self.appeal_timestamp[key] = self._now()

    @gl.public.view
    def get_appeal_status(self, user: str, platform: str) -> str:
        key = self._platform_key(user, platform)
        status = self.appeal_status.get(key, "NONE")
        if status == "NONE":
            return json.dumps({"is_appealed": False, "status": "NONE"}, sort_keys=True)
        return json.dumps(
            {
                "is_appealed": True,
                "status": status,
                "reason": self.appeal_reason.get(key, ""),
                "initiator": self.appeal_initiator.get(key, ""),
                "timestamp": int(self.appeal_timestamp.get(key, u256(0))),
            },
            sort_keys=True,
        )

    @gl.public.write
    def resolve_appeal(self, user: str, platform: str, new_score: u256) -> None:
        self._require_validator()
        key = self._platform_key(user, platform)
        if self.appeal_status.get(key, "NONE") != "PENDING":
            raise Exception("No pending appeal found")
        if new_score > u256(100):
            raise Exception("Score must be 0-100")
        self.platform_scores[key] = new_score
        self.platform_scores_timestamp[key] = self._now()
        self._update_total_karma_with_categories(user)
        self._save_to_history(user)
        self.appeal_status[key] = "RESOLVED"

    @gl.public.view
    def get_data_sources(self) -> str:
        return json.dumps(
            {
                "github": {"weight": 25, "category": "contribution"},
                "reddit": {"weight": 20, "category": "community"},
                "discord": {"weight": 15, "category": "community"},
                "twitter": {"weight": 20, "category": "activity"},
                "on_chain": {"weight": 15, "category": "on_chain"},
                "linkedin": {"weight": 5, "category": "contribution"},
            },
            sort_keys=True,
        )

    @gl.public.view
    def get_decay_config(self) -> str:
        return json.dumps(
            {
                "enabled": self.decay_enabled,
                "per_day": int(self.decay_per_day_inactive),
                "threshold_days": int(self.decay_threshold_days),
            },
            sort_keys=True,
        )

    @gl.public.view
    def get_weight_config(self) -> str:
        return json.dumps(
            {
                "github": int(self.weight_github),
                "reddit": int(self.weight_reddit),
                "discord": int(self.weight_discord),
                "twitter": int(self.weight_twitter),
                "on_chain": int(self.weight_on_chain),
                "linkedin": int(self.weight_linkedin),
            },
            sort_keys=True,
        )
