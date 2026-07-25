Status: DONE

Summary:
- Replaced creator-visible settlement ID, description, and legacy result-row authoring with title, settlement-level follow-up, and typed settlement content rows.
- Added settlement content controls for target family, target record, calculable attribute, operation, and value, wired directly to Task 1 settlement content helpers.
- Added person custom-attribute type controls using the required creator-facing labels: 鏁板€? / 寮€鍏? / 閫夐」 / 鏂囨湰.

TDD:
- RED: `node --test tests/robustness.test.cjs --test-name-pattern "settlement authoring|person attribute"` failed on legacy settlement description/result fields.
- GREEN: `node --test tests/robustness.test.cjs --test-name-pattern "settlement authoring|person attribute"` passed with `fail 0`.

Verification:
- `npm.cmd run build` passed.
- `npm.cmd test` failed in `tests/city-building-mount-authoring.test.cjs` on a city mounted-building UI source assertion outside this settlement/person UI slice.

Concerns:
- `npm run build` is blocked by the local PowerShell execution policy for `npm.ps1`; `npm.cmd run build` was used instead.
- Vite build emitted existing bundle-size/static-asset warnings.
- Full repository test verification currently has an unrelated city/building authoring source assertion failure; focused Task 2 regression remains green.
