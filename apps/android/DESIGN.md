# Portfolio Admin design

The owner uses the Android app to change website presentation and check what is ready to ship. The tabs are Sections, Env, Git, Vercel, and Preview. The toolbar opens Settings and connection status.

Use the shared Material 3 Expressive theme with wallpaper-driven color inspired by PixelMusic and visibly grouped controls inspired by Med. The large primary-container summary belongs to Sections and shows how many panels visitors can access. File paths and environment keys use system monospace. Material switches include explicit Visible and Hidden text. Filled actions write changes. Tonal and text actions refresh data or open external records.

Use the bottom bar below 720 dp and a navigation rail for wider windows. Limit reading content to 760 dp. Group related controls with the shared surface primitive. Keep backend feedback inline and announce status changes. Mask manually entered pairing and environment values. Store the ADB-provisioned credential in the debug app’s private no-backup directory. Preserve saved information while refreshing, report delivery feed failures independently, and retain a failed write’s input for correction.

Confirm actions that retry workflows or dispatch a deployment. Show the operation and its target before sending the request.

The launcher and system splash share a two-slider mark with contrasting pill and diamond controls. Android 17 supplies the launcher mask and themed-icon tint. The splash surface follows light and dark mode and hands off at the first application frame.
