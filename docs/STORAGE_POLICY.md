# GitHub-first durability policy

Owner instruction, 2026-11-27: GitHub is the final, primary project store. Losing a chat, model access, or ChatGPT Library must not prevent continuation.

## Required for each meaningful milestone
1. Store exact original source bytes in Git; reuse an existing immutable, hash-verified Git path rather than duplicate identical bytes.
2. Store generated/derived assets, runnable code, dependency/reproduction instructions, editable manifests, renders, test results, reference boards, and meaningful rejected experiments. Store binary bytes directly, or split large originals into documented concatenation parts with SHA-256, byte counts and Git blob IDs. The archive recovery tool must work from a Git clone without ChatGPT.
3. Update AGENTS, PROJECT_STATE, CHANGELOG, asset registry, restart instructions and archive inventory as applicable. Keep approval and rejection status explicit, distinguish visual evidence from automatic checks.
4. Verify new commit's tree and binary blob identities against local files. Never assert backup from a mere link, metadata entry or Library upload. No force push, no deletion of history.
5. GitHub Pages is the review interface, not the source of truth. A successful deployment is not an independent playback test.
6. Library can be an additional backup or transfer mechanism, never the sole permanent storage. Do not store unrelated personal data, credentials or restricted content in this public repo. For disaster recovery beyond GitHub itself, the owner can maintain a separate clone/export.

## Checkpoint cadence — owner-approved 2026-11-27

This section supersedes milestone-only saving and any suggestion to upload every intermediate file immediately. Prefer normal ChatGPT and small recoverable commits; the owner declined new GitHub Actions automation. Existing GitHub Pages publishing stays unchanged. Codex/Work only by separate owner choice, not a default escalation.

| Material | Checkpoint |
|---|---|
| Feedback, approvals, decisions, skills | Small text commit during the same session, before starting dependent work |
| Source code and manifests | After a meaningful coherent change; save before risky or lengthy work |
| Original artwork | At the end of each completed creative batch, before extensive dependent processing |
| Large binaries, test renders, meaningful rejected experiments | Controlled small batches; retain exact bytes and provenance |
| Temporary files, identical duplicates | Omit; reference existing verified bytes |
| Milestone | Verify all required assets/evidence are durable, then formal versioned release |

Do not accumulate an entire milestone in chat or Library before committing. Do not make a separate upload for every scratch file or repeatedly transfer identical bytes. Prefer one coherent small commit at each checkpoint; split large transfers into individually verifiable batches as needed. Record pending paths, hashes (when known), backup location, and next step in a small Git checkpoint whenever transfer must be deferred. Library is a temporary recovery buffer or secondary backup, never proof of Git durability.

If a stream error, timeout, or uncertain upload occurs, stop the heavy transfer rather than repeatedly retrying a large payload in the same turn. On resumption inspect current HEAD and relevant tree/blob identities; reconcile already-successful uploads and retry only missing or mismatched bytes. Report the last verified checkpoint and remaining unsaved work honestly. Keep incomplete work distinct from released/approved versions; never label a partial transfer complete. At session end, commit a concise handoff and verify the resulting branch/tree where possible. Do not promise a future background upload.

No new GitHub Actions build/test/render/upload automation is authorized. Keep the existing Pages deployment mechanism. This policy is intended to reduce transfer overhead and interruption risk, not guarantee absence of stream errors or lower usage.

## Legacy migration
At starting commit 5fbfacae3537655a0e57f896fa38c20460e596e3, all paths, Git blob IDs and byte counts matched for the 8 of 14 ZIP archives that have repository entries. Six historical ZIPs were still Library-only. See [ARCHIVE_MIGRATION.md](ARCHIVE_MIGRATION.md). No claim that this older migration is complete. v0.7.1 is directly stored as versioned source, assets and evidence, not dependent on a new Library archive. Recovery of its source uses the existing Git-stored v0.7 source PNG.
