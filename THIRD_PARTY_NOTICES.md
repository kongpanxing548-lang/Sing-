# Third-party notice pipeline

`third_party/NOTICE_COMPONENTS.json` is DroidDeck's checked-in distribution
inventory. It separates components that clean CI actually links or embeds from
tools that merely happen to be installed on the runner. In particular,
`libiconv` and `gettext` are downloaded by the inherited fetch script but are
not built or linked into the current IPA.

The runtime inventory covers:

- QEMU and the libffi, GLib, pixman, libucontext, libslirp, libepoxy and
  virglrenderer code linked into its dylib;
- EDK II firmware and its QEMU-provided README and licence compilation;
- WebKit's pinned ANGLE tree and its recursively vendored licence files;
- MoltenVK, SPIRV-Cross, and the fixed header/build inputs retrieved by
  MoltenVK's own dependency script;
- the Rust pairing library, StikJIT's MPL notice, a pinned high-confidence
  compatible idevice source tree and its locked iOS runtime dependency graph;
- the vendored fishhook and stb_vorbis sources whose licence notices are
  embedded in their source files.

`scripts/generate_third_party_notices.py` never downloads or writes a generic
licence from memory. It reads the source trees already used by the build,
verifies fixed Git revisions where applicable, copies the original files byte
for byte, and records each SHA-256 in
`build/legal/THIRD_PARTY_NOTICES.manifest.json`. A missing source tree, pin, or
required notice fails the build.

Before any archive is unpacked, `scripts/fetch_sources.sh` verifies it against
the fixed SHA-256 value in `scripts/sources.sh`; this applies equally to fresh
downloads and restored CI-cache files.

`scripts/prepare_stikjit_notices.sh` shallow-fetches idevice v0.1.68 commit
`d32c8189c51c2789496b0768039419c3705498c3` and uses that commit's Cargo.lock
to inventory the normal `aarch64-apple-ios` dependencies of `idevice-ffi` with
its defaults plus the `obfuscate` feature used by idevice's Apple build recipe.
Build, development, and proc-macro-only packages are excluded because they are
not linked into the archive. Each resolved runtime crate and every original
licence/notice file present in its published package are retained; a package
that publishes only a Cargo licence declaration is identified explicitly
rather than being assigned invented boilerplate.

Clean CI runs the generator after all native/Rust dependencies are resolved.
`scripts/package_ipa.sh` then copies the complete generated directory plus the
DroidDeck GPL licence, downstream notice, and source manifest into
`Payload/Husk.app/legal/`. GitHub Actions uploads the same `build/legal/`
directory alongside the IPA/TIPA, so recipients can inspect individual
upstream files without unpacking the app.

The EDK II firmware is inventoried separately from the QEMU dylib. QEMU's
README identifies its corresponding sources as
[EDK II edk2-stable202302](https://github.com/tianocore/edk2/tree/edk2-stable202302),
[OpenSSL OpenSSL_1_1_1s](https://github.com/openssl/openssl/tree/OpenSSL_1_1_1s),
and [Berkeley SoftFloat Release 3e at commit b64af41](https://qemu.googlesource.com/berkeley-softfloat-3/+/b64af41c3276f97f0e181920400ee056b9c88037/).
The generator includes that README and the complete QEMU-provided
`edk2-licenses.txt`, which contains no GPL licence. GPL iPXE option ROMs are
explicitly disabled and not copied into the app.

## Release checks that notices alone do not solve

- StikJIT 1.9.0 does not attest the source revision used for its vendored
  `libidevice_ffi.a`. Binary/header comparison and build chronology identify
  [idevice v0.1.68 commit d32c818](https://github.com/jkcoxson/idevice/commit/d32c8189c51c2789496b0768039419c3705498c3)
  as high-confidence compatible source, and its locked runtime graph is now
  included. This is a reconstructed provenance claim, not proof of the exact
  source used by the StikJIT publisher; obtain upstream attestation or rebuild
  StikJIT from pinned source before representing it as exact corresponding
  source.
- This mechanism preserves upstream notices; it is not a substitute for a
  legal review of licence compatibility or source-offer duration.
