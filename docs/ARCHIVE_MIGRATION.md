# Legacy archive migration audit

2026-11-27, base commit `5fbfacae3537655a0e57f896fa38c20460e596e3`. Complete recursive Git tree compared against manifest repository entries; all listed paths, sizes and Git blob SHAs match for the 8 stored ZIPs. This is a tree audit, not a fresh full-byte reconstruction of all eight ZIPs. The original approved reference ZIP was independently recovered locally and its SHA-256 and approved image hashes verified. Six older archives are still Library-only and cannot be claimed durable in Git:

- DINO_001_Explorer_Sculpt_Candidate.zip
- DINO_Artwork_Puppet_Studio_v0_1.zip
- DINO_Identity_Lock_v1_Candidate.zip
- DINO_Reconstruction_Test_Pack.zip
- Project_DINO_Studio_Pack_v0_1.zip
- Project_DINO_Studio_Pack_v0_2.zip

All 14 original ZIPs are listed in the Library backup folder, with stored hashes in archive_manifest.json. Copy pending ZIPs in verified binary parts, preserving exact bytes, and update archive_manifest.json only after checking actual Git blobs. `python tools/recover_archives.py --verify-only` will continue to report pending until complete. v0.7.1 is stored directly in Git with its exact source dependency, not a Library-only ZIP.
