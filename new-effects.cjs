module.exports=[
  {
    "id": "fade",
    "name": "Fade in / out",
    "icon": "◢",
    "desc": "Smooth beginnings and endings.",
    "detail": "Bring a recording in gently and let it fade out naturally.",
    "controls": [
      [
        "Fade in",
        1500,
        0,
        10000,
        " ms",
        "Instant",
        "Gentle"
      ],
      [
        "Fade out",
        2000,
        0,
        10000,
        " ms",
        "Instant",
        "Gentle"
      ]
    ],
    "note": "Fade times are scaled together if they exceed the recording length. Duration is preserved."
  },
  {
    "id": "normalize",
    "name": "Peak normalization",
    "icon": "↥",
    "desc": "Set a consistent peak level.",
    "detail": "Adjust the entire recording so its loudest sample reaches your target.",
    "controls": [
      [
        "Target peak",
        -1,
        -12,
        -1,
        " dB",
        "More headroom",
        "Louder"
      ]
    ],
    "note": "Peak normalization preserves dynamics. It does not match perceived loudness between songs. Silence stays silent."
  },
  {
    "id": "compressor",
    "name": "Compressor",
    "icon": "⊏",
    "desc": "Tame peaks. Keep the presence.",
    "detail": "Reduce louder passages with linked stereo dynamics and adjustable makeup gain.",
    "controls": [
      [
        "Threshold",
        -24,
        -48,
        0,
        " dB",
        "More compression",
        "Less compression"
      ],
      [
        "Ratio",
        4,
        1,
        12,
        ":1",
        "Gentle",
        "Firm"
      ],
      [
        "Attack",
        10,
        1,
        100,
        " ms",
        "Fast",
        "Slow"
      ],
      [
        "Release",
        150,
        20,
        1000,
        " ms",
        "Fast",
        "Slow"
      ],
      [
        "Makeup gain",
        3,
        0,
        12,
        " dB",
        "Neutral",
        "Boost"
      ]
    ],
    "note": "Attack and release smooth the gain changes. Stereo channels share the same gain to preserve their balance. Peak protection may reduce excessive makeup gain."
  },
  {
    "id": "chorus",
    "name": "Chorus",
    "icon": "≋",
    "desc": "A lush, layered shimmer.",
    "detail": "Blend a gently modulated short copy with the original for a richer texture.",
    "controls": [
      [
        "Cycle time",
        2000,
        200,
        10000,
        " ms",
        "Fast",
        "Slow"
      ],
      [
        "Depth",
        8,
        1,
        12,
        " ms",
        "Subtle",
        "Wide"
      ],
      [
        "Mix",
        40,
        0,
        100,
        "%",
        "Dry",
        "Wet"
      ]
    ],
    "note": "A modulated delay creates subtle pitch movement. Stereo channels use offset modulation; mono remains mono. No feedback or audible echo repeats."
  },
  {
    "id": "phaser",
    "name": "Phaser",
    "icon": "◉",
    "desc": "Sweeping, swirling movement.",
    "detail": "Sweep six all-pass stages through the sound and blend them with the original.",
    "controls": [
      [
        "Cycle time",
        4000,
        200,
        10000,
        " ms",
        "Fast",
        "Slow"
      ],
      [
        "Sweep depth",
        70,
        0,
        100,
        "%",
        "Narrow",
        "Wide"
      ],
      [
        "Mix",
        50,
        0,
        100,
        "%",
        "Dry",
        "Wet"
      ]
    ],
    "note": "The moving phase shifts create notches when mixed with the dry signal. A 50% mix gives the clearest sweeping character."
  },
  {
    "id": "tremolo",
    "name": "Tremolo",
    "icon": "∿",
    "desc": "Rhythmic waves of volume.",
    "detail": "Pulse the recording volume at an adjustable rate without changing its pitch.",
    "controls": [
      [
        "Pulse rate",
        5,
        1,
        20,
        " Hz",
        "Slow",
        "Fast",
        1
      ],
      [
        "Depth",
        70,
        0,
        100,
        "%",
        "Steady",
        "Full pulse"
      ]
    ],
    "note": "Depth controls how far the volume falls on each pulse. Stereo channels move together to preserve the stereo image."
  },
  {
    "id": "bitcrusher",
    "name": "Bitcrusher",
    "icon": "▦",
    "desc": "Retro digital crunch.",
    "detail": "Reduce sample precision and hold samples for a deliberately gritty digital texture.",
    "controls": [
      [
        "Bit depth",
        8,
        4,
        16,
        " bits",
        "Gritty",
        "Clean"
      ],
      [
        "Sample rate",
        10000,
        1000,
        48000,
        " Hz",
        "Lo-fi",
        "Detailed",
        100
      ],
      [
        "Mix",
        70,
        0,
        100,
        "%",
        "Dry",
        "Wet"
      ]
    ],
    "note": "This is a creative effect: aliasing and quantization are intentional. The export sample rate stays unchanged; this control changes the texture."
  }
];
