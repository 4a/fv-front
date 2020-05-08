export function pickColor(seed, brightness) {
    var autoColor =
        "#" +
        "000000" +
        (
            parseInt(
                parseInt(seed, 36)
                    .toExponential()
                    .slice(2, -5),
                10
            ) & 0xffffff
        )
            .toString(16)
            .toUpperCase()
            .slice(-6);
    var num = parseInt(autoColor.slice(1), 16);
    var amt = Math.round(2.55 * brightness);
    var R = (num >> 16) + amt;
    var G = ((num >> 8) & 0x00ff) + amt;
    var B = (num & 0x0000ff) + amt;
    return (
        "#" +
        (
            0x1000000 +
            (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
            (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
            (B < 255 ? (B < 1 ? 0 : B) : 255)
        )
            .toString(16)
            .slice(1)
    );
}
