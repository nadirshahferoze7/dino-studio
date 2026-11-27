# GitHub-first durability policy

Owner instruction, 2026-11-27: GitHub is the final, primary project store. Losing a chat, model access, or ChatGPT Library must not prevent continuation.

## Required for each meaningful milestone
1. Store exact original source bytes in Git; reuse an existing immutable, hash-verified Git path rather than duplicate identical bytes.
2. Store generated/derived assets, runnable code, dependency/reproduction instructions, editable manifests, renders, test results, reference boards, and meaningful rejected experiments. Store binary bytes directly, or split large originals into documented concatenation parts with SHA-256, byte counts and Git blob IDs. The archive recovery tool must work from a Git clone without ChatGPT.
3. Update AGENTS, PROJECT_STATE, CHANGELOG, asset registry, restart instructions and archive inventory as applicable. Keep approval and rejection status explicit, distinguish visual evidence from automatic checks.
4. Verify new commit's tree and binary blob identities against local files. Never assert backup from a mere link, metadata entry or Library upload. No force push, no deletion of history.
5. GitHub Pages is the review interface, not the source of truth. A successful deployment is not an independent playback test.
6. Library can be an additional backup or transfer mechanism, never the sole permanent storage. Do not store unrelated personal data, credentials or restricted content in this public repo. For disaster recovery beyond GitHub itself, the owner can maintain a separate clone/export.

## Legacy migration
At starting commit 5fbfacae3537655a0e57f896fa38c20460e596e3, all paths, Git blob IDs and byte counts matched for the 8 of 14 ZIP archives that have repository entries. Six historical ZIPs were still Library-only. See [ARCHIVE_MIGRATION.md](ARCHIVE_MIGRATION.md). No claim that this older migration is complete. v0.7.1 is directly stored as versioned source, assets and evidence, not dependent on a new Library archive. Recovery of its source uses the existing Git-stored v0.7 source PNG.
