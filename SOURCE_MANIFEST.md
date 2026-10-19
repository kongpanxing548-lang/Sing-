# DroidDeck source manifest

DroidDeck 0.1.0 is based on Husk commit
`2df074b3083ce2913922995f2f99249f1498b554` and is distributed under
GPL-2.0-or-later. The repository revision stamped into an IPA is the preferred
form for modifying DroidDeck and contains the build scripts and downstream
changes used to produce that IPA.

Before publishing an IPA, publish the matching repository revision and place a
direct source/archive link beside the binary. Keep that revision available for
as long as the binary is offered. The build log and `HuskBuildCommit` value in
the app identify the revision (a `-dirty` suffix means it is not release-ready).

Major third-party source pins are recorded in the build inputs:

- QEMU, libffi, libiconv, gettext, GLib, pixman and libslirp URLs and SHA-256 pins:
  `scripts/sources.sh`
- libucontext commit: `scripts/sources.sh`
- WebKit/ANGLE commit: `scripts/build_angle_ios.sh`
- libepoxy and virglrenderer commits: `scripts/build_gpu_ios.sh`
- MoltenVK tag and SPIRV-Cross revision: `scripts/build_moltenvk_ios.sh`
- Rust dependency revisions: `src/rppairing-ios/Cargo.lock`
- StikJIT 1.9.0 source and binary checksum: `docs/01-licensing.md`
- high-confidence compatible source for StikJIT's idevice archive:
  [idevice v0.1.68 commit d32c818](https://github.com/jkcoxson/idevice/commit/d32c8189c51c2789496b0768039419c3705498c3)

`third_party/NOTICE_COMPONENTS.json` is the machine-readable distribution
inventory. `scripts/generate_third_party_notices.py` verifies pinned Git
revisions, hashes release archives, copies the original licence/notice bytes,
and writes `build/legal/THIRD_PARTY_NOTICES.manifest.json`. The generated legal
directory is both embedded in the IPA and uploaded with the CI artifact.

StikJIT does not publish the source revision used for its vendored
`libidevice_ffi.a`. DroidDeck therefore labels idevice v0.1.68/d32c818 as
high-confidence reconstructed compatible source, not as an upstream-attested
exact revision. Clean CI generates a runtime dependency notice from that
commit's Cargo.lock, `idevice-ffi` defaults, and the `obfuscate` feature used by
idevice's Apple build recipe. See `THIRD_PARTY_NOTICES.md` for the remaining
source-provenance caveat.

`libiconv` and `gettext` are currently downloaded by the inherited source
fetcher but are not built or linked by the clean DroidDeck CI path. They are
therefore build inputs only, not represented as distributed runtime
components in the notice inventory.

The QEMU release archive supplies the prebuilt EDK2 firmware copied into the
IPA. Its `pc-bios/README` identifies the corresponding sources as
[EDK II edk2-stable202302](https://github.com/tianocore/edk2/tree/edk2-stable202302),
[OpenSSL OpenSSL_1_1_1s](https://github.com/openssl/openssl/tree/OpenSSL_1_1_1s),
and [Berkeley SoftFloat Release 3e at commit b64af41](https://qemu.googlesource.com/berkeley-softfloat-3/+/b64af41c3276f97f0e181920400ee056b9c88037/).
The complete QEMU-provided `pc-bios/edk2-licenses.txt` (which contains no GPL
licence) and that README are copied into the generated notices as the separate
`edk2-firmware` component. DroidDeck disables the NIC option ROM (`romfile=`)
and does not copy QEMU's GPL iPXE efi-/pxe-* blobs.

The LineageOS guest disk is downloaded by the user after installation and is
not part of the IPA. DroidDeck 0.1.0 also omits the upstream PS4 runtime, Alpine
diagnostic guest, extended AOSP Java resource bundle, and untraceable
`libFilePickerFix.dylib` binary.
