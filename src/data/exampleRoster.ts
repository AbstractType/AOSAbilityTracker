/**
 * Example BattleScribe Age of Sigmar roster JSON used by the 'Load Example'
 * button. A full 2000pt Hedonites of Slaanesh list (exported from New Recruit)
 * with unit stat lines and weapon profiles, so the example demonstrates unit
 * tracking as well as abilities.
 */
export const exampleRoster =
{
  "roster": {
    "costs": [
      {
        "name": "pts",
        "typeId": "points",
        "value": 2000
      }
    ],
    "costLimits": [
      {
        "name": "pts",
        "typeId": "points",
        "value": 2000
      }
    ],
    "forces": [
      {
        "selections": [
          {
            "profiles": [
              {
                "characteristics": [
                  {
                    "$text": "Once Per Battle Round (Army), Start of Battle Round",
                    "name": "Timing",
                    "typeId": "652c-3d84-4e7-14f4"
                  },
                  {
                    "$text": "Pick up to 3 friendly **Hedonites of Slaanesh **units to be the targets.",
                    "name": "Declare",
                    "typeId": "bad3-f9c5-ba46-18cb"
                  },
                  {
                    "$text": "The targets have the **Euphoric** keyword for the rest of the battle round.\nIn addition, for each friendly unit you pick, give your opponent 1 **temptation dice**. During this battle round,\ninstead of making a wound roll, save roll, ward roll or run roll, your opponent can use 1 temptation dice to replace the roll they would have made with a 6, or instead of making a charge roll they can use 2 temptation dice to replace 2 of the dice in a charge roll with two 6s (other dice could then be rolled normally). Rolls that have been replaced count as unmodified rolls and cannot be re-rolled. You cannot use temptation dice to replace a re-roll.\nEach time your opponent uses a **temptation dice**, they must roll it. On a 1-2, your opponent’s roll is replaced by that value instead of a 6, and you must allocate D3 damage points to the unit for which the roll was replaced immediately after the ability used by that unit has been resolved (ward rolls cannot be made for those damage points).\nAt the end of the battle round, any temptation dice that have not been used are lost.",
                    "name": "Effect",
                    "typeId": "b6f1-ba36-6cd-3b03"
                  },
                  {
                    "name": "Keywords",
                    "typeId": "12e8-3214-7d8f-1d0f"
                  },
                  {
                    "name": "Used By",
                    "typeId": "1b32-c9d6-3106-166b"
                  }
                ],
                "attributes": [
                  {
                    "$text": "Black",
                    "name": "Color",
                    "typeId": "5a11-eab3-180c-ddf5"
                  },
                  {
                    "$text": "Special",
                    "name": "Type",
                    "typeId": "6d16-c86b-2698-85a4"
                  },
                  {
                    "name": "Parent Node",
                    "typeId": "2d74-4dcd-8468-87fa"
                  }
                ],
                "id": "5e45-93e3-812-ec14",
                "name": "An Excess of Depravity",
                "hidden": false,
                "typeId": "59b6-d47a-a68a-5dcc",
                "typeName": "Ability (Activated)",
                "from": "entry"
              },
              {
                "characteristics": [
                  {
                    "name": "Keywords",
                    "typeId": "b977-7c5e-33b2-428e"
                  },
                  {
                    "$text": "While a friendly unit has the **Euphoric **keyword:\n• That unit’s weapons, including **Companion **weapons, have **Crit (2 Hits)**.\n• That unit can use a **Run **ability and still use **Shoot **and/or **Charge** abilities later in the turn.\n\n\n **Designer’s Note:** ***Note that ‘Sadistic Spite’ does not affect **Companion** weapons.***",
                    "name": "Effect",
                    "typeId": "fd7f-888d-3257-a12b"
                  }
                ],
                "attributes": [
                  {
                    "$text": "Black",
                    "name": "Color",
                    "typeId": "50fe-4f29-6bc3-dcc6"
                  },
                  {
                    "$text": "Special",
                    "name": "Type",
                    "typeId": "bf11-4e10-3ab1-06f4"
                  },
                  {
                    "name": "Parent Node",
                    "typeId": "e2e1-15ca-d345-22b8"
                  }
                ],
                "id": "f71a-320b-cc60-c9ff",
                "name": "Euphoric Killers",
                "hidden": false,
                "typeId": "907f-a48-6a04-f788",
                "typeName": "Ability (Passive)",
                "from": "entry"
              }
            ],
            "categories": [
              {
                "id": "3360-1158-e879-9606",
                "entryId": "3360-1158-e879-9606",
                "name": "Reference",
                "primary": true
              }
            ],
            "id": "xwulopg",
            "name": "Battle Traits: Hedonites of Slaanesh",
            "entryId": "9eab-ba5b-5d29-3c72::77b8-2e38-40f0-4472",
            "number": 1,
            "type": "upgrade",
            "from": "entry"
          },
          {
            "selections": [
              {
                "profiles": [
                  {
                    "characteristics": [
                      {
                        "name": "Keywords",
                        "typeId": "b977-7c5e-33b2-428e"
                      },
                      {
                        "$text": "Add 1 to the Rend characteristic of melee weapons used by friendly **Sybarite Infantry **units while they are wholly outside friendly territory",
                        "name": "Effect",
                        "typeId": "fd7f-888d-3257-a12b"
                      }
                    ],
                    "attributes": [
                      {
                        "$text": "Red",
                        "name": "Color",
                        "typeId": "50fe-4f29-6bc3-dcc6"
                      },
                      {
                        "$text": "Offensive",
                        "name": "Type",
                        "typeId": "bf11-4e10-3ab1-06f4"
                      },
                      {
                        "name": "Parent Node",
                        "typeId": "e2e1-15ca-d345-22b8"
                      }
                    ],
                    "id": "0184-bec1-4f4f-b17e",
                    "name": "Ecstatic Revellers",
                    "hidden": false,
                    "typeId": "907f-a48-6a04-f788",
                    "typeName": "Ability (Passive)",
                    "from": "entry"
                  }
                ],
                "costs": [
                  {
                    "name": "pts",
                    "typeId": "points",
                    "value": 10
                  }
                ],
                "id": "is8r29f",
                "name": "Invaders",
                "entryId": "cf91-d723-589f-6e22::3adc-4841-c235-4584",
                "entryGroupId": "cf91-d723-589f-6e22::22cc-a0d6-614c-3468",
                "number": 1,
                "type": "upgrade",
                "from": "group",
                "group": "Battle Formations: Hedonites of Slaanesh"
              }
            ],
            "categories": [
              {
                "id": "ac97-b27c-7e35-7ab9",
                "entryId": "ac97-b27c-7e35-7ab9",
                "name": "Army Composition",
                "primary": true
              }
            ],
            "id": "467zb6",
            "name": "Battle Formation",
            "entryId": "9fe3-ad15-6800-71f7",
            "number": 1,
            "type": "upgrade",
            "from": "entry"
          },
          {
            "selections": [
              {
                "profiles": [
                  {
                    "characteristics": [
                      {
                        "name": "Card",
                        "typeId": "67f1-ce6d-1cf4-a4df"
                      },
                      {
                        "$text": "Cut Off The Head: \nYou complete this battle tactic at the end of your turn if an enemy **Hero **has been destroyed this battle.",
                        "name": "Affray",
                        "typeId": "1047-3e43-674d-dc6c"
                      },
                      {
                        "$text": "Seize the Paths: \nYou complete this battle tactic at the end of your turn if there are more friendly units in neutral territory than enemy units. \nIf there is no neutral territory in the battleplan you are playing, you complete this tactic at the end of your turn if there are no enemy units within friendly territory.",
                        "name": "Strike",
                        "typeId": "94d4-173e-0f65-c569"
                      },
                      {
                        "$text": "Envelop and Strangle:\nYou complete this battle tactic at the end of your turn if at least three different friendly units are each wholly within 9\" of a different corner of the battlefield and only 1 of those corners is wholly within friendly territory. No more than 1 of those units can have been set up this turn.",
                        "name": "Domination",
                        "typeId": "e1d7-1d3c-f001-62e0"
                      }
                    ],
                    "id": "c45f-dc73-39f3-24c9",
                    "name": "Master the Paths",
                    "hidden": false,
                    "typeId": "abf8-a239-9e66-54c1",
                    "typeName": "Battle Tactic Card",
                    "from": "entry"
                  }
                ],
                "id": "it1nhl5",
                "name": "Master the Paths",
                "entryId": "f5d1-f1d9-1dd5-5061",
                "entryGroupId": "e3d8-8106-a496-2ece",
                "number": 1,
                "type": "upgrade",
                "from": "group",
                "group": "Battle Tactic Cards"
              },
              {
                "profiles": [
                  {
                    "characteristics": [
                      {
                        "$text": "• At the start of the battle, your opponent must pick 3 of their units on the battlefield to be carrying a Ghyranite Treasure. They cannot pick faction terrain features or **Manifestations**. A unit can only carry 1 Ghyranite Treasure. If your opponent has fewer than 3 units on the battlefield, you automatically complete a number of these battle tactics, starting with the **Domination **battle tactic (followed by the **Strike **and then the **Affray**) until the number of remaining uncompleted battle tactics equals the number of enemy units on the battlefield.\n• If you went second in the previous battle round and choose to go first in the current battle round, your opponent can remove 1 Ghyranite Treasure from one of their units at the start of the battle round.\n• If an ability would remove a unit that was carrying treasure from the battlefield and that unit is not set up again as part of the same ability (e.g. ‘Dark Apotheosis’ or ‘Red Ruin’), before removing that unit from the battlefield, your opponent must give the treasure it was carrying to another one of their units that does not have a Ghyranite treasure within 3\" of that unit. If this is not possible, that unit counts as having been destroyed for the purpose of this battle tactics card.",
                        "name": "Card",
                        "typeId": "67f1-ce6d-1cf4-a4df"
                      },
                      {
                        "$text": "Stolen Seedpod:\nYou complete this battle tactic at the end of your turn if at least 1 enemy unit carrying a Ghyranite Treasure has been destroyed this battle.",
                        "name": "Affray",
                        "typeId": "1047-3e43-674d-dc6c"
                      },
                      {
                        "$text": "Contraband Aqua Ghyranis:\nYou complete this battle tactic at the end of your turn if at least 2 enemy units carrying a Ghyranite Treasure have been destroyed this battle.",
                        "name": "Strike",
                        "typeId": "94d4-173e-0f65-c569"
                      },
                      {
                        "$text": "Ley Line Taproot:\nYou complete this battle tactic at the end of your turn if at least 3 enemy units carrying a Ghyranite Treasure have been destroyed this battle.",
                        "name": "Domination",
                        "typeId": "e1d7-1d3c-f001-62e0"
                      }
                    ],
                    "id": "a365-06ad-19a1-528d",
                    "name": "Intercept and Recover",
                    "hidden": false,
                    "typeId": "abf8-a239-9e66-54c1",
                    "typeName": "Battle Tactic Card",
                    "from": "entry"
                  }
                ],
                "id": "itjdago",
                "name": "Intercept and Recover",
                "entryId": "545c-5467-b8b6-2b1b",
                "entryGroupId": "e3d8-8106-a496-2ece",
                "number": 1,
                "type": "upgrade",
                "from": "group",
                "group": "Battle Tactic Cards"
              }
            ],
            "categories": [
              {
                "id": "ac97-b27c-7e35-7ab9",
                "entryId": "ac97-b27c-7e35-7ab9",
                "name": "Army Composition",
                "primary": true
              }
            ],
            "id": "48k257",
            "name": "Battle Tactic Cards",
            "entryId": "1668-6989-2470-5e10",
            "number": 1,
            "type": "upgrade",
            "from": "entry"
          },
          {
            "categories": [
              {
                "id": "ac97-b27c-7e35-7ab9",
                "entryId": "ac97-b27c-7e35-7ab9",
                "name": "Army Composition",
                "primary": true
              }
            ],
            "id": "4aaal3l",
            "name": "Manifestation Lore",
            "entryId": "24b9-572f-300a-f410",
            "number": 1,
            "type": "upgrade",
            "from": "entry"
          },
          {
            "selections": [
              {
                "selections": [
                  {
                    "profiles": [
                      {
                        "characteristics": [
                          {
                            "$text": "Your Hero Phase",
                            "name": "Timing",
                            "typeId": "de6f-d57b-248a-83be"
                          },
                          {
                            "$text": "7",
                            "name": "Casting Value",
                            "typeId": "9fc7-b0f6-d018-a608"
                          },
                          {
                            "$text": "Pick a friendly **Hedonites of Slaanesh Wizard** to cast this spell, pick a visible enemy unit within 18\" of them to be the target, then make a casting roll of 2D6.",
                            "name": "Declare",
                            "typeId": "24f8-3803-4ab1-3b6c"
                          },
                          {
                            "$text": "Add 1 to wound rolls for attacks that target that enemy unit until the start of your next turn.",
                            "name": "Effect",
                            "typeId": "1cb9-a-1345-907f"
                          },
                          {
                            "$text": "**Spell**",
                            "name": "Keywords",
                            "typeId": "353f-565e-c351-1cf2"
                          }
                        ],
                        "attributes": [
                          {
                            "$text": "Yellow",
                            "name": "Color",
                            "typeId": "16b6-0911-f549-a4bd"
                          },
                          {
                            "$text": "Offensive",
                            "name": "Parent Node",
                            "typeId": "da27-8d61-f955-5031"
                          }
                        ],
                        "id": "4e7-3bd0-b982-e2ac",
                        "name": "Overwhelming Acquiescence",
                        "hidden": false,
                        "typeId": "7312-8367-c171-f2ef",
                        "typeName": "Ability (Spell)",
                        "from": "entry"
                      }
                    ],
                    "id": "4fldpi",
                    "name": "Overwhelming Acquiescence",
                    "entryId": "938e-c4bb-ca41-33e9::61ef-4dea-20a3-f346::3627-4b2a-6812-1b25",
                    "entryGroupId": "938e-c4bb-ca41-33e9::61ef-4dea-20a3-f346::a740-8833-9146-5ead",
                    "number": 1,
                    "type": "upgrade",
                    "from": "group",
                    "group": "Lore of Extravagance"
                  },
                  {
                    "profiles": [
                      {
                        "characteristics": [
                          {
                            "$text": "Your Hero Phase",
                            "name": "Timing",
                            "typeId": "de6f-d57b-248a-83be"
                          },
                          {
                            "$text": "5",
                            "name": "Casting Value",
                            "typeId": "9fc7-b0f6-d018-a608"
                          },
                          {
                            "$text": "Pick a friendly **Hedonites of Slaanesh Wizard **to cast this spell, pick a visible enemy unit within 12\" of them to be the target, then make a casting roll of 2D6.",
                            "name": "Declare",
                            "typeId": "24f8-3803-4ab1-3b6c"
                          },
                          {
                            "$text": "Until the start of your next turn, each time the target is picked to use a **Fight **ability, before reactions are used, you can pick a friendly unit in combat with the target. That friendly unit can move 2D3\" after the **fight** ability has been resolved. It can pass through the combat ranges of enemy units and can end that move in combat.",
                            "name": "Effect",
                            "typeId": "1cb9-a-1345-907f"
                          },
                          {
                            "$text": "**Spell**",
                            "name": "Keywords",
                            "typeId": "353f-565e-c351-1cf2"
                          }
                        ],
                        "attributes": [
                          {
                            "$text": "Yellow",
                            "name": "Color",
                            "typeId": "16b6-0911-f549-a4bd"
                          },
                          {
                            "$text": "Movement",
                            "name": "Parent Node",
                            "typeId": "da27-8d61-f955-5031"
                          }
                        ],
                        "id": "90b7-4f61-a98c-ffc1",
                        "name": "Phantasmagoria",
                        "hidden": false,
                        "typeId": "7312-8367-c171-f2ef",
                        "typeName": "Ability (Spell)",
                        "from": "entry"
                      }
                    ],
                    "id": "4ffq1qp",
                    "name": "Phantasmagoria",
                    "entryId": "938e-c4bb-ca41-33e9::61ef-4dea-20a3-f346::7b9c-7233-85fc-0390",
                    "entryGroupId": "938e-c4bb-ca41-33e9::61ef-4dea-20a3-f346::a740-8833-9146-5ead",
                    "number": 1,
                    "type": "upgrade",
                    "from": "group",
                    "group": "Lore of Extravagance"
                  },
                  {
                    "profiles": [
                      {
                        "characteristics": [
                          {
                            "$text": "Your Hero Phase",
                            "name": "Timing",
                            "typeId": "de6f-d57b-248a-83be"
                          },
                          {
                            "$text": "6",
                            "name": "Casting Value",
                            "typeId": "9fc7-b0f6-d018-a608"
                          },
                          {
                            "$text": "Pick a friendly **Hedonites of Slaanesh Wizard **to cast this spell, pick a visible friendly **Euphoric **unit to be the target, then make a casting roll of 2D6.",
                            "name": "Declare",
                            "typeId": "24f8-3803-4ab1-3b6c"
                          },
                          {
                            "$text": "The target’s melee weapons have **Crit (Mortal)**instead of **Crit (2 Hits)** for the rest of the battle round.",
                            "name": "Effect",
                            "typeId": "1cb9-a-1345-907f"
                          },
                          {
                            "$text": "**Spell**, **Unlimited**",
                            "name": "Keywords",
                            "typeId": "353f-565e-c351-1cf2"
                          }
                        ],
                        "attributes": [
                          {
                            "$text": "Yellow",
                            "name": "Color",
                            "typeId": "16b6-0911-f549-a4bd"
                          },
                          {
                            "$text": "Offensive",
                            "name": "Parent Node",
                            "typeId": "da27-8d61-f955-5031"
                          }
                        ],
                        "id": "fd34-61d4-3eab-e844",
                        "name": "Sadistic Spite",
                        "hidden": false,
                        "typeId": "7312-8367-c171-f2ef",
                        "typeName": "Ability (Spell)",
                        "from": "entry"
                      }
                    ],
                    "id": "4e5qj4",
                    "name": "Sadistic Spite",
                    "entryId": "938e-c4bb-ca41-33e9::61ef-4dea-20a3-f346::c41d-7a19-bc94-e48b",
                    "entryGroupId": "938e-c4bb-ca41-33e9::61ef-4dea-20a3-f346::a740-8833-9146-5ead",
                    "number": 1,
                    "type": "upgrade",
                    "from": "group",
                    "group": "Lore of Extravagance"
                  }
                ],
                "id": "4dlkzmq",
                "name": "Lore of Extravagance",
                "entryId": "938e-c4bb-ca41-33e9::c085-6e5e-a0ce-fb46",
                "entryGroupId": "938e-c4bb-ca41-33e9::a0dd-82b8-8dcd-c15a",
                "number": 1,
                "type": "upgrade",
                "from": "group",
                "group": "Spell Lores"
              }
            ],
            "categories": [
              {
                "id": "ac97-b27c-7e35-7ab9",
                "entryId": "ac97-b27c-7e35-7ab9",
                "name": "Army Composition",
                "primary": true
              }
            ],
            "id": "4dqlxxt",
            "name": "Spell Lore",
            "entryId": "24b6-2275-f051-2a24",
            "number": 1,
            "type": "upgrade",
            "from": "entry"
          },
          {
            "rules": [
              {
                "description": "**The following universal terrain abilities apply to this terrain feature (Terrain, 1.2):\nCover, Impassable**",
                "id": "f39f-bd91-532b-999",
                "name": "Fane of Slaanesh",
                "hidden": false
              }
            ],
            "profiles": [
              {
                "characteristics": [
                  {
                    "$text": "Your Hero Phase",
                    "name": "Timing",
                    "typeId": "652c-3d84-4e7-14f4"
                  },
                  {
                    "$text": "Pick a friendly **Hedonites of Slaanesh **unit wholly within 12\" of this terrain feature to be the target.",
                    "name": "Declare",
                    "typeId": "bad3-f9c5-ba46-18cb"
                  },
                  {
                    "$text": "Allocate D3 damage points to the target (ward rolls cannot be made for those damage points). Then, pick 1 of the following effects to apply until the start of  your next turn:\n• Add 1 to wound rolls for the target’s combat attacks.\n• Add 1 to run rolls and charge rolls for the target.\n• Add 1 to casting rolls and unbinding rolls for the target.",
                    "name": "Effect",
                    "typeId": "b6f1-ba36-6cd-3b03"
                  },
                  {
                    "name": "Keywords",
                    "typeId": "12e8-3214-7d8f-1d0f"
                  },
                  {
                    "name": "Used By",
                    "typeId": "1b32-c9d6-3106-166b"
                  }
                ],
                "attributes": [
                  {
                    "$text": "Yellow",
                    "name": "Color",
                    "typeId": "5a11-eab3-180c-ddf5"
                  },
                  {
                    "$text": "Special",
                    "name": "Type",
                    "typeId": "6d16-c86b-2698-85a4"
                  },
                  {
                    "name": "Parent Node",
                    "typeId": "2d74-4dcd-8468-87fa"
                  }
                ],
                "id": "c0aa-df5e-6df8-f65d",
                "name": "Damned Conduit",
                "hidden": false,
                "typeId": "59b6-d47a-a68a-5dcc",
                "typeName": "Ability (Activated)",
                "from": "entry"
              },
              {
                "characteristics": [
                  {
                    "$text": "-",
                    "name": "Move",
                    "typeId": "fed0-d1b3-1bb8-c501"
                  },
                  {
                    "$text": "10",
                    "name": "Health",
                    "typeId": "96be-54ae-ce7b-10b7"
                  },
                  {
                    "$text": "4+",
                    "name": "Save",
                    "typeId": "1981-ef09-96f6-7aa9"
                  },
                  {
                    "$text": "-",
                    "name": "Control",
                    "typeId": "6c6f-8510-9ce1-fc6e"
                  }
                ],
                "id": "6f47-50f1-1e37-8e67",
                "name": "Fane of Slaanesh",
                "hidden": false,
                "typeId": "ff03-376e-972f-8ab2",
                "typeName": "Unit",
                "from": "entry"
              },
              {
                "characteristics": [
                  {
                    "name": "Keywords",
                    "typeId": "b977-7c5e-33b2-428e"
                  },
                  {
                    "$text": "In step 1 of the damage sequence (see 18.0), make a **ward roll **of D6 for each **damage point **in this unit’s **damage pool**. If the roll equals or exceeds this unit’s **ward value**, remove that damage point from the damage pool.",
                    "name": "Effect",
                    "typeId": "fd7f-888d-3257-a12b"
                  }
                ],
                "attributes": [
                  {
                    "$text": "Black",
                    "name": "Color",
                    "typeId": "50fe-4f29-6bc3-dcc6"
                  },
                  {
                    "$text": "Defensive",
                    "name": "Type",
                    "typeId": "bf11-4e10-3ab1-06f4"
                  },
                  {
                    "name": "Parent Node",
                    "typeId": "e2e1-15ca-d345-22b8"
                  }
                ],
                "id": "ed70-f30-2f5a-747f",
                "name": "Ward Save",
                "hidden": false,
                "typeId": "907f-a48-6a04-f788",
                "typeName": "Ability (Passive)",
                "from": "entry"
              }
            ],
            "categories": [
              {
                "id": "cdd6-ffa1-9b32-4cb8",
                "entryId": "cdd6-ffa1-9b32-4cb8",
                "name": "FACTION TERRAIN",
                "primary": true
              },
              {
                "id": "70a4-383f-421f-52cd",
                "name": "WARD (6+)",
                "entryId": "70a4-383f-421f-52cd",
                "primary": false
              },
              {
                "id": "319b-38ee-d10d-e800",
                "name": "CHAOS",
                "entryId": "319b-38ee-d10d-e800",
                "primary": false
              },
              {
                "id": "67df-cdfb-d83f-3197",
                "name": "HEDONITES OF SLAANESH",
                "entryId": "67df-cdfb-d83f-3197",
                "primary": false
              }
            ],
            "id": "4fjlukt",
            "name": "Fane of Slaanesh",
            "entryId": "a080-ae8d-69c-3193::bad2-41cf-b054-d9b3",
            "number": 1,
            "type": "unit",
            "from": "entry"
          }
        ],
        "costs": [
          {
            "name": "Force Category - GHB",
            "typeId": "de92-2099-fbf7-a156",
            "value": 1
          }
        ],
        "categories": [
          {
            "name": "Uncategorized",
            "id": "n0x0xig",
            "primary": false,
            "entryId": "(No Category)"
          },
          {
            "name": "Configuration",
            "id": "n0bxqgl",
            "primary": false,
            "entryId": "676-2b78-7bbf-ba9c"
          },
          {
            "name": "Reference",
            "id": "iemlb3nr",
            "primary": false,
            "entryId": "3360-1158-e879-9606"
          },
          {
            "name": "Army Composition",
            "id": "3iwrp16",
            "primary": false,
            "entryId": "ac97-b27c-7e35-7ab9"
          },
          {
            "name": "FACTION TERRAIN",
            "id": "3ir75ms",
            "primary": false,
            "entryId": "cdd6-ffa1-9b32-4cb8"
          },
          {
            "name": "Illegal Units",
            "id": "n11gac",
            "primary": false,
            "entryId": "(Illegal Units)"
          }
        ],
        "forces": [
          {
            "selections": [
              {
                "profiles": [
                  {
                    "characteristics": [
                      {
                        "$text": "8\"",
                        "name": "Move",
                        "typeId": "fed0-d1b3-1bb8-c501"
                      },
                      {
                        "$text": "18",
                        "name": "Health",
                        "typeId": "96be-54ae-ce7b-10b7"
                      },
                      {
                        "$text": "4+",
                        "name": "Save",
                        "typeId": "1981-ef09-96f6-7aa9"
                      },
                      {
                        "$text": "5",
                        "name": "Control",
                        "typeId": "6c6f-8510-9ce1-fc6e"
                      }
                    ],
                    "id": "2356-acea-ac09-3a24",
                    "name": "Glutos Orscollion, Lord of Gluttony",
                    "hidden": false,
                    "typeId": "ff03-376e-972f-8ab2",
                    "typeName": "Unit",
                    "from": "entry"
                  },
                  {
                    "characteristics": [
                      {
                        "$text": "End of Any Turn",
                        "name": "Timing",
                        "typeId": "652c-3d84-4e7-14f4"
                      },
                      {
                        "$text": "Pick a friendly **Sybarite** unit wholly within 12\" of this unit to be the target.",
                        "name": "Declare",
                        "typeId": "bad3-f9c5-ba46-18cb"
                      },
                      {
                        "$text": "**Heal (6)**the target.",
                        "name": "Effect",
                        "typeId": "b6f1-ba36-6cd-3b03"
                      },
                      {
                        "name": "Keywords",
                        "typeId": "12e8-3214-7d8f-1d0f"
                      },
                      {
                        "name": "Used By",
                        "typeId": "1b32-c9d6-3106-166b"
                      }
                    ],
                    "attributes": [
                      {
                        "$text": "Purple",
                        "name": "Color",
                        "typeId": "5a11-eab3-180c-ddf5"
                      },
                      {
                        "$text": "Defensive",
                        "name": "Type",
                        "typeId": "6d16-c86b-2698-85a4"
                      },
                      {
                        "name": "Parent Node",
                        "typeId": "2d74-4dcd-8468-87fa"
                      }
                    ],
                    "id": "437b-af31-be16-73ff",
                    "name": "Gorge on Excess",
                    "hidden": false,
                    "typeId": "59b6-d47a-a68a-5dcc",
                    "typeName": "Ability (Activated)",
                    "from": "entry"
                  },
                  {
                    "characteristics": [
                      {
                        "name": "Keywords",
                        "typeId": "b977-7c5e-33b2-428e"
                      },
                      {
                        "$text": "A different effect applies to friendly **Sybarite** units each battle round while they are wholly within 12\" of this unit, as shown below. The effects of all previous battle rounds also apply to those units while they are wholly within 12\" of this unit.\n **Battle Round 1:**\n***Starter:*** Add 1 to run rolls and charge rolls for those units.\n **Battle Round 2:**\n***Main:*** Add 3 to those units’ control scores.\n **Battle Round 3:**\n***Dessert:*** Add 1 to hit rolls for those unit’s attacks.\n **Battle Round 4+:**\n***Digestif:*** Add 1 to the Rend characteristic of those units’ melee weapons.",
                        "name": "Effect",
                        "typeId": "fd7f-888d-3257-a12b"
                      }
                    ],
                    "attributes": [
                      {
                        "$text": "Black",
                        "name": "Color",
                        "typeId": "50fe-4f29-6bc3-dcc6"
                      },
                      {
                        "$text": "Special",
                        "name": "Type",
                        "typeId": "bf11-4e10-3ab1-06f4"
                      },
                      {
                        "name": "Parent Node",
                        "typeId": "e2e1-15ca-d345-22b8"
                      }
                    ],
                    "id": "67e3-1d88-9bb4-4906",
                    "name": "The Grand Gourmand",
                    "hidden": false,
                    "typeId": "907f-a48-6a04-f788",
                    "typeName": "Ability (Passive)",
                    "from": "entry"
                  },
                  {
                    "characteristics": [
                      {
                        "$text": "Your Hero Phase",
                        "name": "Timing",
                        "typeId": "de6f-d57b-248a-83be"
                      },
                      {
                        "$text": "7",
                        "name": "Casting Value",
                        "typeId": "9fc7-b0f6-d018-a608"
                      },
                      {
                        "$text": "Pick a visible enemy unit within 18\" of this unit to be the target, then make a casting roll of 2D6.",
                        "name": "Declare",
                        "typeId": "24f8-3803-4ab1-3b6c"
                      },
                      {
                        "$text": "Until the start of your next turn:\n• Halve the target’s Move characteristic.\n• Halve run rolls and charge rolls for the target.",
                        "name": "Effect",
                        "typeId": "1cb9-a-1345-907f"
                      },
                      {
                        "$text": "**Spell**",
                        "name": "Keywords",
                        "typeId": "353f-565e-c351-1cf2"
                      }
                    ],
                    "attributes": [
                      {
                        "$text": "Yellow",
                        "name": "Color",
                        "typeId": "16b6-0911-f549-a4bd"
                      },
                      {
                        "$text": "Movement",
                        "name": "Parent Node",
                        "typeId": "da27-8d61-f955-5031"
                      }
                    ],
                    "id": "28b9-9c9b-3e06-d093",
                    "name": "Crippling Famishment",
                    "hidden": false,
                    "typeId": "7312-8367-c171-f2ef",
                    "typeName": "Ability (Spell)",
                    "from": "entry"
                  },
                  {
                    "characteristics": [
                      {
                        "name": "Keywords",
                        "typeId": "b977-7c5e-33b2-428e"
                      },
                      {
                        "$text": "While this unit has 10 or more damage points, the Attacks characteristic of its **Greatblade and Claws **is 6.",
                        "name": "Effect",
                        "typeId": "fd7f-888d-3257-a12b"
                      }
                    ],
                    "attributes": [
                      {
                        "$text": "Black",
                        "name": "Color",
                        "typeId": "50fe-4f29-6bc3-dcc6"
                      },
                      {
                        "$text": "Damage",
                        "name": "Type",
                        "typeId": "bf11-4e10-3ab1-06f4"
                      },
                      {
                        "name": "Parent Node",
                        "typeId": "e2e1-15ca-d345-22b8"
                      }
                    ],
                    "id": "8dce-246a-9a52-2f1f",
                    "name": "Battle Damaged",
                    "hidden": false,
                    "typeId": "907f-a48-6a04-f788",
                    "typeName": "Ability (Passive)",
                    "from": "entry"
                  },
                  {
                    "characteristics": [
                      {
                        "name": "Keywords",
                        "typeId": "b977-7c5e-33b2-428e"
                      },
                      {
                        "$text": "In step 1 of the damage sequence (see 18.0), make a **ward roll **of D6 for each **damage point **in this unit’s **damage pool**. If the roll equals or exceeds this unit’s **ward value**, remove that damage point from the damage pool.",
                        "name": "Effect",
                        "typeId": "fd7f-888d-3257-a12b"
                      }
                    ],
                    "attributes": [
                      {
                        "$text": "Black",
                        "name": "Color",
                        "typeId": "50fe-4f29-6bc3-dcc6"
                      },
                      {
                        "$text": "Defensive",
                        "name": "Type",
                        "typeId": "bf11-4e10-3ab1-06f4"
                      },
                      {
                        "name": "Parent Node",
                        "typeId": "e2e1-15ca-d345-22b8"
                      }
                    ],
                    "id": "ed70-f30-2f5a-747f",
                    "name": "Ward Save",
                    "hidden": false,
                    "typeId": "907f-a48-6a04-f788",
                    "typeName": "Ability (Passive)",
                    "from": "entry"
                  }
                ],
                "selections": [
                  {
                    "id": "plmlooh",
                    "name": "General",
                    "entryId": "e6cc-9cda-6e08-4921::2f3d-7d70-c960-8fd4::a56b-952e-ad15-7868",
                    "number": 1,
                    "type": "upgrade",
                    "from": "entry"
                  },
                  {
                    "selections": [
                      {
                        "profiles": [
                          {
                            "characteristics": [
                              {
                                "$text": "8",
                                "name": "Atk",
                                "typeId": "60e-35aa-31ed-e488"
                              },
                              {
                                "$text": "3+",
                                "name": "Hit",
                                "typeId": "26dc-168-b2fd-cb93"
                              },
                              {
                                "$text": "3+",
                                "name": "Wnd",
                                "typeId": "61c1-22cc-40af-2847"
                              },
                              {
                                "$text": "1",
                                "name": "Rnd",
                                "typeId": "eccc-10fa-6958-fb73"
                              },
                              {
                                "$text": "3",
                                "name": "Dmg",
                                "typeId": "e948-9c71-12a6-6be4"
                              },
                              {
                                "$text": "Companion",
                                "name": "Ability",
                                "typeId": "eda3-7332-5db1-4159"
                              }
                            ],
                            "id": "28a1-e487-2f7e-a841",
                            "name": "Greatblade and Claws",
                            "hidden": false,
                            "typeId": "9074-76b6-9e2f-81e3",
                            "typeName": "Melee Weapon",
                            "from": "entry"
                          }
                        ],
                        "id": "podxxam",
                        "name": "Greatblade and Claws",
                        "entryId": "e6cc-9cda-6e08-4921::2aff-b1ef-a37-346e",
                        "number": 1,
                        "type": "upgrade",
                        "from": "entry"
                      },
                      {
                        "profiles": [
                          {
                            "characteristics": [
                              {
                                "$text": "12\"",
                                "name": "Rng",
                                "typeId": "c6b5-908c-a604-1a98"
                              },
                              {
                                "$text": "1",
                                "name": "Atk",
                                "typeId": "aa17-4296-2887-e05d"
                              },
                              {
                                "$text": "2+",
                                "name": "Hit",
                                "typeId": "194d-aeb6-5ba7-83b4"
                              },
                              {
                                "$text": "2+",
                                "name": "Wnd",
                                "typeId": "d3d5-9dc6-13de-8d1"
                              },
                              {
                                "$text": "-",
                                "name": "Rnd",
                                "typeId": "d03f-a9ae-3eec-755"
                              },
                              {
                                "$text": "6",
                                "name": "Dmg",
                                "typeId": "96c2-d0a5-ea1e-653b"
                              },
                              {
                                "$text": "Shoot in Combat",
                                "name": "Ability",
                                "typeId": "d793-3dd7-9c13-741e"
                              }
                            ],
                            "id": "b1cd-c6d0-cd3b-2ba6",
                            "name": "Leerstave of Loth’shar",
                            "hidden": false,
                            "typeId": "1fd-a42f-41d3-fe05",
                            "typeName": "Ranged Weapon",
                            "from": "entry"
                          }
                        ],
                        "id": "pokw7ye",
                        "name": "Leerstave of Loth’shar",
                        "entryId": "e6cc-9cda-6e08-4921::1fe1-6e73-10df-192b",
                        "number": 1,
                        "type": "upgrade",
                        "from": "entry"
                      },
                      {
                        "profiles": [
                          {
                            "characteristics": [
                              {
                                "$text": "4",
                                "name": "Atk",
                                "typeId": "60e-35aa-31ed-e488"
                              },
                              {
                                "$text": "3+",
                                "name": "Hit",
                                "typeId": "26dc-168-b2fd-cb93"
                              },
                              {
                                "$text": "4+",
                                "name": "Wnd",
                                "typeId": "61c1-22cc-40af-2847"
                              },
                              {
                                "$text": "-",
                                "name": "Rnd",
                                "typeId": "eccc-10fa-6958-fb73"
                              },
                              {
                                "$text": "1",
                                "name": "Dmg",
                                "typeId": "e948-9c71-12a6-6be4"
                              },
                              {
                                "$text": "Companion",
                                "name": "Ability",
                                "typeId": "eda3-7332-5db1-4159"
                              }
                            ],
                            "id": "1806-b186-b701-8531",
                            "name": "Scourge and Dagger",
                            "hidden": false,
                            "typeId": "9074-76b6-9e2f-81e3",
                            "typeName": "Melee Weapon",
                            "from": "entry"
                          }
                        ],
                        "id": "poj0e9f",
                        "name": "Scourge and Dagger",
                        "entryId": "e6cc-9cda-6e08-4921::bca8-26ff-fc30-f6f0",
                        "number": 1,
                        "type": "upgrade",
                        "from": "entry"
                      }
                    ],
                    "id": "plspqv",
                    "name": "Glutos Orscollion, Lord of Gluttony",
                    "entryId": "e6cc-9cda-6e08-4921::eb67-8aa-9f1b-f683",
                    "number": 1,
                    "type": "model",
                    "from": "entry"
                  }
                ],
                "costs": [
                  {
                    "name": "pts",
                    "typeId": "points",
                    "value": 440
                  }
                ],
                "categories": [
                  {
                    "id": "6e72-1656-d554-528a",
                    "name": "HERO",
                    "entryId": "6e72-1656-d554-528a",
                    "primary": false
                  },
                  {
                    "id": "72ce-2188-70bf-2dbd",
                    "name": "UNIQUE",
                    "entryId": "72ce-2188-70bf-2dbd",
                    "primary": false
                  },
                  {
                    "id": "c203-51a0-3d44-6b07",
                    "name": "WARMASTER",
                    "entryId": "c203-51a0-3d44-6b07",
                    "primary": false
                  },
                  {
                    "id": "319b-38ee-d10d-e800",
                    "name": "CHAOS",
                    "entryId": "319b-38ee-d10d-e800",
                    "primary": false
                  },
                  {
                    "id": "52cc-95fd-6cd3-8f72",
                    "name": "WARD (5+)",
                    "entryId": "52cc-95fd-6cd3-8f72",
                    "primary": false
                  },
                  {
                    "id": "67df-cdfb-d83f-3197",
                    "name": "HEDONITES OF SLAANESH",
                    "entryId": "67df-cdfb-d83f-3197",
                    "primary": false
                  },
                  {
                    "id": "f7bc-b618-4b5d-2bae",
                    "name": "WAR MACHINE",
                    "entryId": "f7bc-b618-4b5d-2bae",
                    "primary": false
                  },
                  {
                    "id": "8179-697a-9f4c-91d4",
                    "name": "WIZARD (2)",
                    "entryId": "8179-697a-9f4c-91d4",
                    "primary": false
                  },
                  {
                    "id": "9a4b-cd0b-84e1-16c5",
                    "name": "SYBARITE",
                    "entryId": "9a4b-cd0b-84e1-16c5",
                    "primary": false
                  },
                  {
                    "id": "db3a-7199-c92e-f3cf",
                    "name": "Regimental Option",
                    "entryId": "db3a-7199-c92e-f3cf",
                    "primary": false
                  },
                  {
                    "id": "d1f3-921c-b403-1106",
                    "entryId": "d1f3-921c-b403-1106",
                    "name": "Regimental Leader",
                    "primary": true
                  }
                ],
                "id": "pjm38v5",
                "name": "Glutos Orscollion, Lord of Gluttony",
                "entryId": "e6cc-9cda-6e08-4921::fac2-b0a0-feec-f70f",
                "number": 1,
                "type": "unit",
                "from": "entry"
              },
              {
                "profiles": [
                  {
                    "characteristics": [
                      {
                        "$text": "6\"",
                        "name": "Move",
                        "typeId": "fed0-d1b3-1bb8-c501"
                      },
                      {
                        "$text": "1",
                        "name": "Health",
                        "typeId": "96be-54ae-ce7b-10b7"
                      },
                      {
                        "$text": "6+",
                        "name": "Save",
                        "typeId": "1981-ef09-96f6-7aa9"
                      },
                      {
                        "$text": "1",
                        "name": "Control",
                        "typeId": "6c6f-8510-9ce1-fc6e"
                      }
                    ],
                    "id": "839-fd59-615-613",
                    "name": "Blissbarb Archers",
                    "hidden": false,
                    "typeId": "ff03-376e-972f-8ab2",
                    "typeName": "Unit",
                    "from": "entry"
                  },
                  {
                    "characteristics": [
                      {
                        "name": "Keywords",
                        "typeId": "b977-7c5e-33b2-428e"
                      },
                      {
                        "$text": "This unit’s **Blissbrew Homonculus** is a token. There is 1 **Blissbrew Homonculus **for every 10 models in this unit.\nSubtract 1 from hit rolls for shooting attacks that target this unit while it has a **Blissbrew Homonculus**. If you make an unmodified save roll of 1 for this unit, remove the **Blissbrew Homonculus **from the battlefield after the Attack ability has been resolved (the damage point is still inflicted).",
                        "name": "Effect",
                        "typeId": "fd7f-888d-3257-a12b"
                      }
                    ],
                    "attributes": [
                      {
                        "$text": "Green",
                        "name": "Color",
                        "typeId": "50fe-4f29-6bc3-dcc6"
                      },
                      {
                        "$text": "Defensive",
                        "name": "Type",
                        "typeId": "bf11-4e10-3ab1-06f4"
                      },
                      {
                        "name": "Parent Node",
                        "typeId": "e2e1-15ca-d345-22b8"
                      }
                    ],
                    "id": "4e44-7769-baad-8488",
                    "name": "Blissbrew Homonculus",
                    "hidden": false,
                    "typeId": "907f-a48-6a04-f788",
                    "typeName": "Ability (Passive)",
                    "from": "entry"
                  }
                ],
                "selections": [
                  {
                    "selections": [
                      {
                        "profiles": [
                          {
                            "characteristics": [
                              {
                                "$text": "18\"",
                                "name": "Rng",
                                "typeId": "c6b5-908c-a604-1a98"
                              },
                              {
                                "$text": "2",
                                "name": "Atk",
                                "typeId": "aa17-4296-2887-e05d"
                              },
                              {
                                "$text": "3+",
                                "name": "Hit",
                                "typeId": "194d-aeb6-5ba7-83b4"
                              },
                              {
                                "$text": "4+",
                                "name": "Wnd",
                                "typeId": "d3d5-9dc6-13de-8d1"
                              },
                              {
                                "$text": "1",
                                "name": "Rnd",
                                "typeId": "d03f-a9ae-3eec-755"
                              },
                              {
                                "$text": "1",
                                "name": "Dmg",
                                "typeId": "96c2-d0a5-ea1e-653b"
                              },
                              {
                                "$text": "-",
                                "name": "Ability",
                                "typeId": "d793-3dd7-9c13-741e"
                              }
                            ],
                            "id": "b529-ffc8-7c30-6a28",
                            "name": "Blissbarb Bow",
                            "hidden": false,
                            "typeId": "1fd-a42f-41d3-fe05",
                            "typeName": "Ranged Weapon",
                            "from": "entry"
                          }
                        ],
                        "id": "gefdryi",
                        "name": "Blissbarb Bow",
                        "entryId": "9d84-476c-99d7-bc26::e51b-dd14-8e1-2858",
                        "number": 19,
                        "type": "upgrade",
                        "from": "entry"
                      },
                      {
                        "profiles": [
                          {
                            "characteristics": [
                              {
                                "$text": "1",
                                "name": "Atk",
                                "typeId": "60e-35aa-31ed-e488"
                              },
                              {
                                "$text": "3+",
                                "name": "Hit",
                                "typeId": "26dc-168-b2fd-cb93"
                              },
                              {
                                "$text": "4+",
                                "name": "Wnd",
                                "typeId": "61c1-22cc-40af-2847"
                              },
                              {
                                "$text": "-",
                                "name": "Rnd",
                                "typeId": "eccc-10fa-6958-fb73"
                              },
                              {
                                "$text": "1",
                                "name": "Dmg",
                                "typeId": "e948-9c71-12a6-6be4"
                              },
                              {
                                "$text": "-",
                                "name": "Ability",
                                "typeId": "eda3-7332-5db1-4159"
                              }
                            ],
                            "id": "c629-6584-20ce-af9f",
                            "name": "Sybarite Blade",
                            "hidden": false,
                            "typeId": "9074-76b6-9e2f-81e3",
                            "typeName": "Melee Weapon",
                            "from": "entry"
                          }
                        ],
                        "id": "gemk88v",
                        "name": "Sybarite Blade",
                        "entryId": "9d84-476c-99d7-bc26::283b-8492-5f37-f8e1",
                        "number": 19,
                        "type": "upgrade",
                        "from": "entry"
                      }
                    ],
                    "id": "gdfvtw7",
                    "name": "Blissbarb Archer",
                    "entryId": "9d84-476c-99d7-bc26::35d-6c68-da98-8373",
                    "number": 19,
                    "type": "model",
                    "from": "entry"
                  },
                  {
                    "selections": [
                      {
                        "profiles": [
                          {
                            "characteristics": [
                              {
                                "$text": "18\"",
                                "name": "Rng",
                                "typeId": "c6b5-908c-a604-1a98"
                              },
                              {
                                "$text": "2",
                                "name": "Atk",
                                "typeId": "aa17-4296-2887-e05d"
                              },
                              {
                                "$text": "3+",
                                "name": "Hit",
                                "typeId": "194d-aeb6-5ba7-83b4"
                              },
                              {
                                "$text": "4+",
                                "name": "Wnd",
                                "typeId": "d3d5-9dc6-13de-8d1"
                              },
                              {
                                "$text": "1",
                                "name": "Rnd",
                                "typeId": "d03f-a9ae-3eec-755"
                              },
                              {
                                "$text": "1",
                                "name": "Dmg",
                                "typeId": "96c2-d0a5-ea1e-653b"
                              },
                              {
                                "$text": "-",
                                "name": "Ability",
                                "typeId": "d793-3dd7-9c13-741e"
                              }
                            ],
                            "id": "b529-ffc8-7c30-6a28",
                            "name": "Blissbarb Bow",
                            "hidden": false,
                            "typeId": "1fd-a42f-41d3-fe05",
                            "typeName": "Ranged Weapon",
                            "from": "entry"
                          }
                        ],
                        "id": "huui0ga",
                        "name": "Blissbarb Bow",
                        "entryId": "9d84-476c-99d7-bc26::e51b-dd14-8e1-2858",
                        "number": 1,
                        "type": "upgrade",
                        "from": "entry"
                      },
                      {
                        "profiles": [
                          {
                            "characteristics": [
                              {
                                "$text": "1",
                                "name": "Atk",
                                "typeId": "60e-35aa-31ed-e488"
                              },
                              {
                                "$text": "3+",
                                "name": "Hit",
                                "typeId": "26dc-168-b2fd-cb93"
                              },
                              {
                                "$text": "4+",
                                "name": "Wnd",
                                "typeId": "61c1-22cc-40af-2847"
                              },
                              {
                                "$text": "-",
                                "name": "Rnd",
                                "typeId": "eccc-10fa-6958-fb73"
                              },
                              {
                                "$text": "1",
                                "name": "Dmg",
                                "typeId": "e948-9c71-12a6-6be4"
                              },
                              {
                                "$text": "-",
                                "name": "Ability",
                                "typeId": "eda3-7332-5db1-4159"
                              }
                            ],
                            "id": "c629-6584-20ce-af9f",
                            "name": "Sybarite Blade",
                            "hidden": false,
                            "typeId": "9074-76b6-9e2f-81e3",
                            "typeName": "Melee Weapon",
                            "from": "entry"
                          }
                        ],
                        "id": "hvb5qtc",
                        "name": "Sybarite Blade",
                        "entryId": "9d84-476c-99d7-bc26::283b-8492-5f37-f8e1",
                        "number": 1,
                        "type": "upgrade",
                        "from": "entry"
                      },
                      {
                        "profiles": [
                          {
                            "characteristics": [
                              {
                                "name": "Keywords",
                                "typeId": "b977-7c5e-33b2-428e"
                              },
                              {
                                "$text": "Add 1 to the Attacks characteristic of weapons used by champions in this unit.",
                                "name": "Effect",
                                "typeId": "fd7f-888d-3257-a12b"
                              }
                            ],
                            "attributes": [
                              {
                                "$text": "Red",
                                "name": "Color",
                                "typeId": "50fe-4f29-6bc3-dcc6"
                              },
                              {
                                "$text": "Offensive",
                                "name": "Type",
                                "typeId": "bf11-4e10-3ab1-06f4"
                              },
                              {
                                "name": "Parent Node",
                                "typeId": "e2e1-15ca-d345-22b8"
                              }
                            ],
                            "id": "6ba-36a4-3848-65d1",
                            "name": "Champion",
                            "hidden": false,
                            "typeId": "907f-a48-6a04-f788",
                            "typeName": "Ability (Passive)",
                            "from": "entry"
                          }
                        ],
                        "categories": [
                          {
                            "id": "9c77-5e0b-a20f-d885",
                            "name": "Command Model",
                            "entryId": "9c77-5e0b-a20f-d885",
                            "primary": false
                          }
                        ],
                        "id": "hweg1h7",
                        "name": "Champion",
                        "entryId": "9d84-476c-99d7-bc26::3652-707d-189-ae41::9c21-1746-9873-a5b5",
                        "entryGroupId": "9d84-476c-99d7-bc26::7044-1634-80ba-af2b",
                        "number": 1,
                        "type": "upgrade",
                        "from": "group",
                        "group": "Command Models"
                      }
                    ],
                    "id": "htb292k",
                    "name": "Blissbarb Archer",
                    "entryId": "9d84-476c-99d7-bc26::35d-6c68-da98-8373",
                    "number": 1,
                    "type": "model",
                    "from": "entry"
                  },
                  {
                    "id": "g96u9p",
                    "name": "Reinforced",
                    "entryId": "4e6-33d6-5d6d-9a4f::1b37-82b8-c062-eb82",
                    "number": 1,
                    "type": "upgrade",
                    "from": "entry"
                  }
                ],
                "costs": [
                  {
                    "name": "pts",
                    "typeId": "points",
                    "value": 300
                  }
                ],
                "categories": [
                  {
                    "id": "75d6-6995-dfcc-3898",
                    "entryId": "75d6-6995-dfcc-3898",
                    "name": "INFANTRY",
                    "primary": true
                  },
                  {
                    "id": "f679-3bcb-d664-9ac3",
                    "name": "CHAMPION",
                    "entryId": "f679-3bcb-d664-9ac3",
                    "primary": false
                  },
                  {
                    "id": "319b-38ee-d10d-e800",
                    "name": "CHAOS",
                    "entryId": "319b-38ee-d10d-e800",
                    "primary": false
                  },
                  {
                    "id": "67df-cdfb-d83f-3197",
                    "name": "HEDONITES OF SLAANESH",
                    "entryId": "67df-cdfb-d83f-3197",
                    "primary": false
                  },
                  {
                    "id": "9a4b-cd0b-84e1-16c5",
                    "name": "SYBARITE",
                    "entryId": "9a4b-cd0b-84e1-16c5",
                    "primary": false
                  },
                  {
                    "id": "db3a-7199-c92e-f3cf",
                    "name": "Regimental Option",
                    "entryId": "db3a-7199-c92e-f3cf",
                    "primary": false
                  }
                ],
                "id": "g3wxfsm",
                "name": "Blissbarb Archers",
                "entryId": "9d84-476c-99d7-bc26::7516-fef5-83f7-22a7",
                "number": 1,
                "type": "unit",
                "from": "entry"
              },
              {
                "profiles": [
                  {
                    "characteristics": [
                      {
                        "$text": "6\"",
                        "name": "Move",
                        "typeId": "fed0-d1b3-1bb8-c501"
                      },
                      {
                        "$text": "2",
                        "name": "Health",
                        "typeId": "96be-54ae-ce7b-10b7"
                      },
                      {
                        "$text": "3+",
                        "name": "Save",
                        "typeId": "1981-ef09-96f6-7aa9"
                      },
                      {
                        "$text": "1",
                        "name": "Control",
                        "typeId": "6c6f-8510-9ce1-fc6e"
                      }
                    ],
                    "id": "7ead-f7db-fb3d-fcf",
                    "name": "Myrmidesh Painbringers",
                    "hidden": false,
                    "typeId": "ff03-376e-972f-8ab2",
                    "typeName": "Unit",
                    "from": "entry"
                  },
                  {
                    "characteristics": [
                      {
                        "name": "Keywords",
                        "typeId": "b977-7c5e-33b2-428e"
                      },
                      {
                        "$text": "Add 1 to the Rend characteristic of this unit’s melee weapons while it is contesting an objective you do not control.",
                        "name": "Effect",
                        "typeId": "fd7f-888d-3257-a12b"
                      }
                    ],
                    "attributes": [
                      {
                        "$text": "Red",
                        "name": "Color",
                        "typeId": "50fe-4f29-6bc3-dcc6"
                      },
                      {
                        "$text": "Offensive",
                        "name": "Type",
                        "typeId": "bf11-4e10-3ab1-06f4"
                      },
                      {
                        "name": "Parent Node",
                        "typeId": "e2e1-15ca-d345-22b8"
                      }
                    ],
                    "id": "b838-7d26-f8e-4459",
                    "name": "Paragons of Battle",
                    "hidden": false,
                    "typeId": "907f-a48-6a04-f788",
                    "typeName": "Ability (Passive)",
                    "from": "entry"
                  }
                ],
                "selections": [
                  {
                    "selections": [
                      {
                        "profiles": [
                          {
                            "characteristics": [
                              {
                                "$text": "3",
                                "name": "Atk",
                                "typeId": "60e-35aa-31ed-e488"
                              },
                              {
                                "$text": "3+",
                                "name": "Hit",
                                "typeId": "26dc-168-b2fd-cb93"
                              },
                              {
                                "$text": "3+",
                                "name": "Wnd",
                                "typeId": "61c1-22cc-40af-2847"
                              },
                              {
                                "$text": "1",
                                "name": "Rnd",
                                "typeId": "eccc-10fa-6958-fb73"
                              },
                              {
                                "$text": "1",
                                "name": "Dmg",
                                "typeId": "e948-9c71-12a6-6be4"
                              },
                              {
                                "$text": "-",
                                "name": "Ability",
                                "typeId": "eda3-7332-5db1-4159"
                              }
                            ],
                            "id": "21c5-f1c6-e388-f055",
                            "name": "Wicked Scimitar",
                            "hidden": false,
                            "typeId": "9074-76b6-9e2f-81e3",
                            "typeName": "Melee Weapon",
                            "from": "entry"
                          }
                        ],
                        "id": "25s0o1x",
                        "name": "Wicked Scimitar",
                        "entryId": "481f-346e-e960-c6d7::c6f9-db86-3060-a5aa",
                        "number": 1,
                        "type": "upgrade",
                        "from": "entry"
                      },
                      {
                        "profiles": [
                          {
                            "characteristics": [
                              {
                                "name": "Keywords",
                                "typeId": "b977-7c5e-33b2-428e"
                              },
                              {
                                "$text": "Add 1 to the Attacks characteristic of weapons used by champions in this unit.",
                                "name": "Effect",
                                "typeId": "fd7f-888d-3257-a12b"
                              }
                            ],
                            "attributes": [
                              {
                                "$text": "Red",
                                "name": "Color",
                                "typeId": "50fe-4f29-6bc3-dcc6"
                              },
                              {
                                "$text": "Offensive",
                                "name": "Type",
                                "typeId": "bf11-4e10-3ab1-06f4"
                              },
                              {
                                "name": "Parent Node",
                                "typeId": "e2e1-15ca-d345-22b8"
                              }
                            ],
                            "id": "6ba-36a4-3848-65d1",
                            "name": "Champion",
                            "hidden": false,
                            "typeId": "907f-a48-6a04-f788",
                            "typeName": "Ability (Passive)",
                            "from": "entry"
                          }
                        ],
                        "categories": [
                          {
                            "id": "9c77-5e0b-a20f-d885",
                            "name": "Command Model",
                            "entryId": "9c77-5e0b-a20f-d885",
                            "primary": false
                          }
                        ],
                        "id": "25kpfza",
                        "name": "Champion",
                        "entryId": "481f-346e-e960-c6d7::635e-8719-b23e-3832::9c21-1746-9873-a5b5",
                        "entryGroupId": "481f-346e-e960-c6d7::ea28-728-dbce-19af",
                        "number": 1,
                        "type": "upgrade",
                        "from": "group",
                        "group": "Command Models"
                      }
                    ],
                    "id": "25kome",
                    "name": "Myrmidesh Painbringer",
                    "entryId": "481f-346e-e960-c6d7::1c07-7a37-4c77-cc86",
                    "number": 1,
                    "type": "model",
                    "from": "entry"
                  },
                  {
                    "selections": [
                      {
                        "profiles": [
                          {
                            "characteristics": [
                              {
                                "$text": "3",
                                "name": "Atk",
                                "typeId": "60e-35aa-31ed-e488"
                              },
                              {
                                "$text": "3+",
                                "name": "Hit",
                                "typeId": "26dc-168-b2fd-cb93"
                              },
                              {
                                "$text": "3+",
                                "name": "Wnd",
                                "typeId": "61c1-22cc-40af-2847"
                              },
                              {
                                "$text": "1",
                                "name": "Rnd",
                                "typeId": "eccc-10fa-6958-fb73"
                              },
                              {
                                "$text": "1",
                                "name": "Dmg",
                                "typeId": "e948-9c71-12a6-6be4"
                              },
                              {
                                "$text": "-",
                                "name": "Ability",
                                "typeId": "eda3-7332-5db1-4159"
                              }
                            ],
                            "id": "21c5-f1c6-e388-f055",
                            "name": "Wicked Scimitar",
                            "hidden": false,
                            "typeId": "9074-76b6-9e2f-81e3",
                            "typeName": "Melee Weapon",
                            "from": "entry"
                          }
                        ],
                        "id": "266cht4",
                        "name": "Wicked Scimitar",
                        "entryId": "481f-346e-e960-c6d7::c6f9-db86-3060-a5aa",
                        "number": 4,
                        "type": "upgrade",
                        "from": "entry"
                      }
                    ],
                    "id": "2538fz",
                    "name": "Myrmidesh Painbringer",
                    "entryId": "481f-346e-e960-c6d7::1c07-7a37-4c77-cc86",
                    "number": 4,
                    "type": "model",
                    "from": "entry"
                  }
                ],
                "costs": [
                  {
                    "name": "pts",
                    "typeId": "points",
                    "value": 100
                  }
                ],
                "categories": [
                  {
                    "id": "67df-cdfb-d83f-3197",
                    "name": "HEDONITES OF SLAANESH",
                    "entryId": "67df-cdfb-d83f-3197",
                    "primary": false
                  },
                  {
                    "id": "319b-38ee-d10d-e800",
                    "name": "CHAOS",
                    "entryId": "319b-38ee-d10d-e800",
                    "primary": false
                  },
                  {
                    "id": "f679-3bcb-d664-9ac3",
                    "name": "CHAMPION",
                    "entryId": "f679-3bcb-d664-9ac3",
                    "primary": false
                  },
                  {
                    "id": "75d6-6995-dfcc-3898",
                    "entryId": "75d6-6995-dfcc-3898",
                    "name": "INFANTRY",
                    "primary": true
                  },
                  {
                    "id": "9a4b-cd0b-84e1-16c5",
                    "name": "SYBARITE",
                    "entryId": "9a4b-cd0b-84e1-16c5",
                    "primary": false
                  },
                  {
                    "id": "db3a-7199-c92e-f3cf",
                    "name": "Regimental Option",
                    "entryId": "db3a-7199-c92e-f3cf",
                    "primary": false
                  }
                ],
                "id": "23odp7p",
                "name": "Myrmidesh Painbringers",
                "entryId": "481f-346e-e960-c6d7::af06-7271-8760-4a4",
                "number": 1,
                "type": "unit",
                "from": "entry"
              },
              {
                "profiles": [
                  {
                    "characteristics": [
                      {
                        "$text": "6\"",
                        "name": "Move",
                        "typeId": "fed0-d1b3-1bb8-c501"
                      },
                      {
                        "$text": "2",
                        "name": "Health",
                        "typeId": "96be-54ae-ce7b-10b7"
                      },
                      {
                        "$text": "4+",
                        "name": "Save",
                        "typeId": "1981-ef09-96f6-7aa9"
                      },
                      {
                        "$text": "1",
                        "name": "Control",
                        "typeId": "6c6f-8510-9ce1-fc6e"
                      }
                    ],
                    "id": "23a2-7e2c-360-47a4",
                    "name": "Symbaresh Twinsouls",
                    "hidden": false,
                    "typeId": "ff03-376e-972f-8ab2",
                    "typeName": "Unit",
                    "from": "entry"
                  },
                  {
                    "characteristics": [
                      {
                        "name": "Keywords",
                        "typeId": "b977-7c5e-33b2-428e"
                      },
                      {
                        "$text": "If this unit did not charge this turn, it has **Ward (5+)**while it is in combat.",
                        "name": "Effect",
                        "typeId": "fd7f-888d-3257-a12b"
                      }
                    ],
                    "attributes": [
                      {
                        "$text": "Green",
                        "name": "Color",
                        "typeId": "50fe-4f29-6bc3-dcc6"
                      },
                      {
                        "$text": "Defensive",
                        "name": "Type",
                        "typeId": "bf11-4e10-3ab1-06f4"
                      },
                      {
                        "name": "Parent Node",
                        "typeId": "e2e1-15ca-d345-22b8"
                      }
                    ],
                    "id": "b175-ab7b-fea9-d0b3",
                    "name": "Fiendish Reflexes",
                    "hidden": false,
                    "typeId": "907f-a48-6a04-f788",
                    "typeName": "Ability (Passive)",
                    "from": "entry"
                  },
                  {
                    "characteristics": [
                      {
                        "name": "Keywords",
                        "typeId": "b977-7c5e-33b2-428e"
                      },
                      {
                        "$text": "If this unit did not charge this turn, subtract 1 from the Attacks characteristic of melee weapons used by enemy units while they are in combat with this unit.",
                        "name": "Effect",
                        "typeId": "fd7f-888d-3257-a12b"
                      }
                    ],
                    "attributes": [
                      {
                        "$text": "Green",
                        "name": "Color",
                        "typeId": "50fe-4f29-6bc3-dcc6"
                      },
                      {
                        "$text": "Defensive",
                        "name": "Type",
                        "typeId": "bf11-4e10-3ab1-06f4"
                      },
                      {
                        "name": "Parent Node",
                        "typeId": "e2e1-15ca-d345-22b8"
                      }
                    ],
                    "id": "59d5-6aa3-aa0f-1366",
                    "name": "Ego-driven Excess",
                    "hidden": false,
                    "typeId": "907f-a48-6a04-f788",
                    "typeName": "Ability (Passive)",
                    "from": "entry"
                  }
                ],
                "selections": [
                  {
                    "id": "h7lwp8h",
                    "name": "Reinforced",
                    "entryId": "2194-8387-d7fd-831b::1b37-82b8-c062-eb82",
                    "number": 1,
                    "type": "upgrade",
                    "from": "entry"
                  },
                  {
                    "selections": [
                      {
                        "profiles": [
                          {
                            "characteristics": [
                              {
                                "$text": "4",
                                "name": "Atk",
                                "typeId": "60e-35aa-31ed-e488"
                              },
                              {
                                "$text": "3+",
                                "name": "Hit",
                                "typeId": "26dc-168-b2fd-cb93"
                              },
                              {
                                "$text": "4+",
                                "name": "Wnd",
                                "typeId": "61c1-22cc-40af-2847"
                              },
                              {
                                "$text": "1",
                                "name": "Rnd",
                                "typeId": "eccc-10fa-6958-fb73"
                              },
                              {
                                "$text": "1",
                                "name": "Dmg",
                                "typeId": "e948-9c71-12a6-6be4"
                              },
                              {
                                "$text": "-",
                                "name": "Ability",
                                "typeId": "eda3-7332-5db1-4159"
                              }
                            ],
                            "id": "ca8b-f486-1a47-9b01",
                            "name": "Merciless Weapons",
                            "hidden": false,
                            "typeId": "9074-76b6-9e2f-81e3",
                            "typeName": "Melee Weapon",
                            "from": "entry"
                          }
                        ],
                        "id": "h7wy6n",
                        "name": "Merciless Weapons",
                        "entryId": "f468-4cd6-3439-6f96::7a93-23c9-a457-c60f",
                        "number": 1,
                        "type": "upgrade",
                        "from": "entry"
                      },
                      {
                        "profiles": [
                          {
                            "characteristics": [
                              {
                                "name": "Keywords",
                                "typeId": "b977-7c5e-33b2-428e"
                              },
                              {
                                "$text": "Add 1 to the Attacks characteristic of weapons used by champions in this unit.",
                                "name": "Effect",
                                "typeId": "fd7f-888d-3257-a12b"
                              }
                            ],
                            "attributes": [
                              {
                                "$text": "Red",
                                "name": "Color",
                                "typeId": "50fe-4f29-6bc3-dcc6"
                              },
                              {
                                "$text": "Offensive",
                                "name": "Type",
                                "typeId": "bf11-4e10-3ab1-06f4"
                              },
                              {
                                "name": "Parent Node",
                                "typeId": "e2e1-15ca-d345-22b8"
                              }
                            ],
                            "id": "6ba-36a4-3848-65d1",
                            "name": "Champion",
                            "hidden": false,
                            "typeId": "907f-a48-6a04-f788",
                            "typeName": "Ability (Passive)",
                            "from": "entry"
                          }
                        ],
                        "categories": [
                          {
                            "id": "9c77-5e0b-a20f-d885",
                            "name": "Command Model",
                            "entryId": "9c77-5e0b-a20f-d885",
                            "primary": false
                          }
                        ],
                        "id": "h72qzxo",
                        "name": "Champion",
                        "entryId": "f468-4cd6-3439-6f96::a951-db64-6ef6-2075::9c21-1746-9873-a5b5",
                        "entryGroupId": "f468-4cd6-3439-6f96::2cbd-947b-cd04-21c1",
                        "number": 1,
                        "type": "upgrade",
                        "from": "group",
                        "group": "Command Models"
                      }
                    ],
                    "id": "h7fvanj",
                    "name": "Symbaresh Twinsoul",
                    "entryId": "f468-4cd6-3439-6f96::e8ee-16e8-e1dd-2233",
                    "number": 1,
                    "type": "model",
                    "from": "entry"
                  },
                  {
                    "selections": [
                      {
                        "profiles": [
                          {
                            "characteristics": [
                              {
                                "$text": "4",
                                "name": "Atk",
                                "typeId": "60e-35aa-31ed-e488"
                              },
                              {
                                "$text": "3+",
                                "name": "Hit",
                                "typeId": "26dc-168-b2fd-cb93"
                              },
                              {
                                "$text": "4+",
                                "name": "Wnd",
                                "typeId": "61c1-22cc-40af-2847"
                              },
                              {
                                "$text": "1",
                                "name": "Rnd",
                                "typeId": "eccc-10fa-6958-fb73"
                              },
                              {
                                "$text": "1",
                                "name": "Dmg",
                                "typeId": "e948-9c71-12a6-6be4"
                              },
                              {
                                "$text": "-",
                                "name": "Ability",
                                "typeId": "eda3-7332-5db1-4159"
                              }
                            ],
                            "id": "ca8b-f486-1a47-9b01",
                            "name": "Merciless Weapons",
                            "hidden": false,
                            "typeId": "9074-76b6-9e2f-81e3",
                            "typeName": "Melee Weapon",
                            "from": "entry"
                          }
                        ],
                        "id": "h888pxc",
                        "name": "Merciless Weapons",
                        "entryId": "f468-4cd6-3439-6f96::7a93-23c9-a457-c60f",
                        "number": 9,
                        "type": "upgrade",
                        "from": "entry"
                      }
                    ],
                    "id": "h8xcrgm",
                    "name": "Symbaresh Twinsoul",
                    "entryId": "f468-4cd6-3439-6f96::e8ee-16e8-e1dd-2233",
                    "number": 9,
                    "type": "model",
                    "from": "entry"
                  }
                ],
                "costs": [
                  {
                    "name": "pts",
                    "typeId": "points",
                    "value": 260
                  }
                ],
                "categories": [
                  {
                    "id": "67df-cdfb-d83f-3197",
                    "name": "HEDONITES OF SLAANESH",
                    "entryId": "67df-cdfb-d83f-3197",
                    "primary": false
                  },
                  {
                    "id": "319b-38ee-d10d-e800",
                    "name": "CHAOS",
                    "entryId": "319b-38ee-d10d-e800",
                    "primary": false
                  },
                  {
                    "id": "f679-3bcb-d664-9ac3",
                    "name": "CHAMPION",
                    "entryId": "f679-3bcb-d664-9ac3",
                    "primary": false
                  },
                  {
                    "id": "75d6-6995-dfcc-3898",
                    "entryId": "75d6-6995-dfcc-3898",
                    "name": "INFANTRY",
                    "primary": true
                  },
                  {
                    "id": "9a4b-cd0b-84e1-16c5",
                    "name": "SYBARITE",
                    "entryId": "9a4b-cd0b-84e1-16c5",
                    "primary": false
                  },
                  {
                    "id": "db3a-7199-c92e-f3cf",
                    "name": "Regimental Option",
                    "entryId": "db3a-7199-c92e-f3cf",
                    "primary": false
                  }
                ],
                "id": "h6wk8ni",
                "name": "Symbaresh Twinsouls",
                "entryId": "f468-4cd6-3439-6f96::ffcf-47e1-a14f-b507",
                "number": 1,
                "type": "unit",
                "from": "entry"
              },
              {
                "profiles": [
                  {
                    "characteristics": [
                      {
                        "$text": "6\"",
                        "name": "Move",
                        "typeId": "fed0-d1b3-1bb8-c501"
                      },
                      {
                        "$text": "2",
                        "name": "Health",
                        "typeId": "96be-54ae-ce7b-10b7"
                      },
                      {
                        "$text": "4+",
                        "name": "Save",
                        "typeId": "1981-ef09-96f6-7aa9"
                      },
                      {
                        "$text": "1",
                        "name": "Control",
                        "typeId": "6c6f-8510-9ce1-fc6e"
                      }
                    ],
                    "id": "23a2-7e2c-360-47a4",
                    "name": "Symbaresh Twinsouls",
                    "hidden": false,
                    "typeId": "ff03-376e-972f-8ab2",
                    "typeName": "Unit",
                    "from": "entry"
                  },
                  {
                    "characteristics": [
                      {
                        "name": "Keywords",
                        "typeId": "b977-7c5e-33b2-428e"
                      },
                      {
                        "$text": "If this unit did not charge this turn, it has **Ward (5+)** while it is in combat.",
                        "name": "Effect",
                        "typeId": "fd7f-888d-3257-a12b"
                      }
                    ],
                    "attributes": [
                      {
                        "$text": "Green",
                        "name": "Color",
                        "typeId": "50fe-4f29-6bc3-dcc6"
                      },
                      {
                        "$text": "Defensive",
                        "name": "Type",
                        "typeId": "bf11-4e10-3ab1-06f4"
                      },
                      {
                        "name": "Parent Node",
                        "typeId": "e2e1-15ca-d345-22b8"
                      }
                    ],
                    "id": "b175-ab7b-fea9-d0b3",
                    "name": "Fiendish Reflexes",
                    "hidden": false,
                    "typeId": "907f-a48-6a04-f788",
                    "typeName": "Ability (Passive)",
                    "from": "entry"
                  },
                  {
                    "characteristics": [
                      {
                        "name": "Keywords",
                        "typeId": "b977-7c5e-33b2-428e"
                      },
                      {
                        "$text": "If this unit did not charge this turn, subtract 1 from the Attacks characteristic of melee weapons used by enemy units while they are in combat with this unit.",
                        "name": "Effect",
                        "typeId": "fd7f-888d-3257-a12b"
                      }
                    ],
                    "attributes": [
                      {
                        "$text": "Green",
                        "name": "Color",
                        "typeId": "50fe-4f29-6bc3-dcc6"
                      },
                      {
                        "$text": "Defensive",
                        "name": "Type",
                        "typeId": "bf11-4e10-3ab1-06f4"
                      },
                      {
                        "name": "Parent Node",
                        "typeId": "e2e1-15ca-d345-22b8"
                      }
                    ],
                    "id": "59d5-6aa3-aa0f-1366",
                    "name": "Ego-driven Excess",
                    "hidden": false,
                    "typeId": "907f-a48-6a04-f788",
                    "typeName": "Ability (Passive)",
                    "from": "entry"
                  }
                ],
                "selections": [
                  {
                    "selections": [
                      {
                        "profiles": [
                          {
                            "characteristics": [
                              {
                                "$text": "4",
                                "name": "Atk",
                                "typeId": "60e-35aa-31ed-e488"
                              },
                              {
                                "$text": "3+",
                                "name": "Hit",
                                "typeId": "26dc-168-b2fd-cb93"
                              },
                              {
                                "$text": "4+",
                                "name": "Wnd",
                                "typeId": "61c1-22cc-40af-2847"
                              },
                              {
                                "$text": "1",
                                "name": "Rnd",
                                "typeId": "eccc-10fa-6958-fb73"
                              },
                              {
                                "$text": "1",
                                "name": "Dmg",
                                "typeId": "e948-9c71-12a6-6be4"
                              },
                              {
                                "$text": "-",
                                "name": "Ability",
                                "typeId": "eda3-7332-5db1-4159"
                              }
                            ],
                            "id": "ca8b-f486-1a47-9b01",
                            "name": "Merciless Weapons",
                            "hidden": false,
                            "typeId": "9074-76b6-9e2f-81e3",
                            "typeName": "Melee Weapon",
                            "from": "entry"
                          }
                        ],
                        "id": "3q3xl3i",
                        "name": "Merciless Weapons",
                        "entryId": "f468-4cd6-3439-6f96::7a93-23c9-a457-c60f",
                        "number": 1,
                        "type": "upgrade",
                        "from": "entry"
                      },
                      {
                        "profiles": [
                          {
                            "characteristics": [
                              {
                                "name": "Keywords",
                                "typeId": "b977-7c5e-33b2-428e"
                              },
                              {
                                "$text": "Add 1 to the Attacks characteristic of weapons used by champions in this unit.",
                                "name": "Effect",
                                "typeId": "fd7f-888d-3257-a12b"
                              }
                            ],
                            "attributes": [
                              {
                                "$text": "Red",
                                "name": "Color",
                                "typeId": "50fe-4f29-6bc3-dcc6"
                              },
                              {
                                "$text": "Offensive",
                                "name": "Type",
                                "typeId": "bf11-4e10-3ab1-06f4"
                              },
                              {
                                "name": "Parent Node",
                                "typeId": "e2e1-15ca-d345-22b8"
                              }
                            ],
                            "id": "6ba-36a4-3848-65d1",
                            "name": "Champion",
                            "hidden": false,
                            "typeId": "907f-a48-6a04-f788",
                            "typeName": "Ability (Passive)",
                            "from": "entry"
                          }
                        ],
                        "categories": [
                          {
                            "id": "9c77-5e0b-a20f-d885",
                            "name": "Command Model",
                            "entryId": "9c77-5e0b-a20f-d885",
                            "primary": false
                          }
                        ],
                        "id": "3rfpj7l",
                        "name": "Champion",
                        "entryId": "f468-4cd6-3439-6f96::a951-db64-6ef6-2075::9c21-1746-9873-a5b5",
                        "entryGroupId": "f468-4cd6-3439-6f96::2cbd-947b-cd04-21c1",
                        "number": 1,
                        "type": "upgrade",
                        "from": "group",
                        "group": "Command Models"
                      }
                    ],
                    "id": "3qlt56",
                    "name": "Symbaresh Twinsoul",
                    "entryId": "f468-4cd6-3439-6f96::e8ee-16e8-e1dd-2233",
                    "number": 1,
                    "type": "model",
                    "from": "entry"
                  },
                  {
                    "selections": [
                      {
                        "profiles": [
                          {
                            "characteristics": [
                              {
                                "$text": "4",
                                "name": "Atk",
                                "typeId": "60e-35aa-31ed-e488"
                              },
                              {
                                "$text": "3+",
                                "name": "Hit",
                                "typeId": "26dc-168-b2fd-cb93"
                              },
                              {
                                "$text": "4+",
                                "name": "Wnd",
                                "typeId": "61c1-22cc-40af-2847"
                              },
                              {
                                "$text": "1",
                                "name": "Rnd",
                                "typeId": "eccc-10fa-6958-fb73"
                              },
                              {
                                "$text": "1",
                                "name": "Dmg",
                                "typeId": "e948-9c71-12a6-6be4"
                              },
                              {
                                "$text": "-",
                                "name": "Ability",
                                "typeId": "eda3-7332-5db1-4159"
                              }
                            ],
                            "id": "ca8b-f486-1a47-9b01",
                            "name": "Merciless Weapons",
                            "hidden": false,
                            "typeId": "9074-76b6-9e2f-81e3",
                            "typeName": "Melee Weapon",
                            "from": "entry"
                          }
                        ],
                        "id": "3srhndv",
                        "name": "Merciless Weapons",
                        "entryId": "f468-4cd6-3439-6f96::7a93-23c9-a457-c60f",
                        "number": 4,
                        "type": "upgrade",
                        "from": "entry"
                      }
                    ],
                    "id": "3s5v0z",
                    "name": "Symbaresh Twinsoul",
                    "entryId": "f468-4cd6-3439-6f96::e8ee-16e8-e1dd-2233",
                    "number": 4,
                    "type": "model",
                    "from": "entry"
                  }
                ],
                "costs": [
                  {
                    "name": "pts",
                    "typeId": "points",
                    "value": 130
                  }
                ],
                "categories": [
                  {
                    "id": "67df-cdfb-d83f-3197",
                    "name": "HEDONITES OF SLAANESH",
                    "entryId": "67df-cdfb-d83f-3197",
                    "primary": false
                  },
                  {
                    "id": "319b-38ee-d10d-e800",
                    "name": "CHAOS",
                    "entryId": "319b-38ee-d10d-e800",
                    "primary": false
                  },
                  {
                    "id": "f679-3bcb-d664-9ac3",
                    "name": "CHAMPION",
                    "entryId": "f679-3bcb-d664-9ac3",
                    "primary": false
                  },
                  {
                    "id": "75d6-6995-dfcc-3898",
                    "entryId": "75d6-6995-dfcc-3898",
                    "name": "INFANTRY",
                    "primary": true
                  },
                  {
                    "id": "9a4b-cd0b-84e1-16c5",
                    "name": "SYBARITE",
                    "entryId": "9a4b-cd0b-84e1-16c5",
                    "primary": false
                  },
                  {
                    "id": "db3a-7199-c92e-f3cf",
                    "name": "Regimental Option",
                    "entryId": "db3a-7199-c92e-f3cf",
                    "primary": false
                  }
                ],
                "id": "3jd4s1e",
                "name": "Symbaresh Twinsouls",
                "entryId": "f468-4cd6-3439-6f96::ffcf-47e1-a14f-b507",
                "number": 1,
                "type": "unit",
                "from": "entry"
              }
            ],
            "categories": [
              {
                "name": "Uncategorized",
                "id": "oa00uwq",
                "primary": false,
                "entryId": "(No Category)"
              },
              {
                "name": "Regimental Leader",
                "id": "76mnup",
                "primary": false,
                "entryId": "d1f3-921c-b403-1106"
              },
              {
                "name": "HERO",
                "id": "ob7fqab",
                "primary": false,
                "entryId": "6e72-1656-d554-528a"
              },
              {
                "name": "INFANTRY",
                "id": "76bzekp",
                "primary": false,
                "entryId": "75d6-6995-dfcc-3898"
              },
              {
                "name": "MONSTER",
                "id": "obsdabx",
                "primary": false,
                "entryId": "6d54-625c-d063-13e2"
              },
              {
                "name": "WAR MACHINE",
                "id": "obixys",
                "primary": false,
                "entryId": "f7bc-b618-4b5d-2bae"
              },
              {
                "name": "CAVALRY",
                "id": "obd82k",
                "primary": false,
                "entryId": "926c-df8c-6841-d49e"
              },
              {
                "name": "BEAST",
                "id": "ob5nqd",
                "primary": false,
                "entryId": "b224-8c8e-ca93-9860"
              },
              {
                "name": "Illegal Units",
                "id": "obq3f2c",
                "primary": false,
                "entryId": "(Illegal Units)"
              }
            ],
            "id": "75isoig",
            "name": "Regiment",
            "entryId": "48a1-e075-c797-5605::376a-6b97-8699-dd59",
            "catalogueId": "afdb-68a1-283e-3bf2",
            "catalogueRevision": 28,
            "catalogueName": "Hedonites of Slaanesh"
          },
          {
            "selections": [
              {
                "profiles": [
                  {
                    "characteristics": [
                      {
                        "$text": "6\"",
                        "name": "Move",
                        "typeId": "fed0-d1b3-1bb8-c501"
                      },
                      {
                        "$text": "5",
                        "name": "Health",
                        "typeId": "96be-54ae-ce7b-10b7"
                      },
                      {
                        "$text": "5+",
                        "name": "Save",
                        "typeId": "1981-ef09-96f6-7aa9"
                      },
                      {
                        "$text": "2",
                        "name": "Control",
                        "typeId": "6c6f-8510-9ce1-fc6e"
                      }
                    ],
                    "id": "3f88-1bd6-66c1-5c5d",
                    "name": "Lord of Hubris",
                    "hidden": false,
                    "typeId": "ff03-376e-972f-8ab2",
                    "typeName": "Unit",
                    "from": "entry"
                  },
                  {
                    "characteristics": [
                      {
                        "$text": "Any Combat Phase",
                        "name": "Timing",
                        "typeId": "652c-3d84-4e7-14f4"
                      },
                      {
                        "$text": "Pick an enemy unit in combat with this unit to be the target.",
                        "name": "Declare",
                        "typeId": "bad3-f9c5-ba46-18cb"
                      },
                      {
                        "$text": "Your opponent must decide whether the target will accept or decline this unit’s challenge.\n***Accept:***The target has **Strike-first** for the rest of the turn. If this unit is in combat with the target when the target is picked to use a **Fight** ability, all of the target’s attacks must target this unit.\n***Decline:***The target has **Strike-last **for the rest of the turn.",
                        "name": "Effect",
                        "typeId": "b6f1-ba36-6cd-3b03"
                      },
                      {
                        "name": "Keywords",
                        "typeId": "12e8-3214-7d8f-1d0f"
                      },
                      {
                        "name": "Used By",
                        "typeId": "1b32-c9d6-3106-166b"
                      }
                    ],
                    "attributes": [
                      {
                        "$text": "Red",
                        "name": "Color",
                        "typeId": "5a11-eab3-180c-ddf5"
                      },
                      {
                        "$text": "Special",
                        "name": "Type",
                        "typeId": "6d16-c86b-2698-85a4"
                      },
                      {
                        "name": "Parent Node",
                        "typeId": "2d74-4dcd-8468-87fa"
                      }
                    ],
                    "id": "803d-7041-688b-7465",
                    "name": "'You First, I Insist...'",
                    "hidden": false,
                    "typeId": "59b6-d47a-a68a-5dcc",
                    "typeName": "Ability (Activated)",
                    "from": "entry"
                  },
                  {
                    "characteristics": [
                      {
                        "$text": "Any Combat Phase",
                        "name": "Timing",
                        "typeId": "652c-3d84-4e7-14f4"
                      },
                      {
                        "$text": "Pick a friendly **Myrmidesh Painbringers **or **Symbaresh Twinsouls** unit that is in combat and is wholly within 12\" of this unit to be the target.",
                        "name": "Declare",
                        "typeId": "bad3-f9c5-ba46-18cb"
                      },
                      {
                        "$text": "Roll a dice. On a 3+, for the rest of the turn, each time a model in the target unit is slain by a combat attack and that model was in combat with the attacking unit, roll a dice. For each 4+, inflict 1 mortal damage on the attacking unit after the **Fight **ability has been resolved.",
                        "name": "Effect",
                        "typeId": "b6f1-ba36-6cd-3b03"
                      },
                      {
                        "name": "Keywords",
                        "typeId": "12e8-3214-7d8f-1d0f"
                      },
                      {
                        "name": "Used By",
                        "typeId": "1b32-c9d6-3106-166b"
                      }
                    ],
                    "attributes": [
                      {
                        "$text": "Red",
                        "name": "Color",
                        "typeId": "5a11-eab3-180c-ddf5"
                      },
                      {
                        "$text": "Offensive",
                        "name": "Type",
                        "typeId": "6d16-c86b-2698-85a4"
                      },
                      {
                        "name": "Parent Node",
                        "typeId": "2d74-4dcd-8468-87fa"
                      }
                    ],
                    "id": "c6ee-6eac-45e7-40",
                    "name": "Only the Best Will Suffice",
                    "hidden": false,
                    "typeId": "59b6-d47a-a68a-5dcc",
                    "typeName": "Ability (Activated)",
                    "from": "entry"
                  },
                  {
                    "characteristics": [
                      {
                        "name": "Keywords",
                        "typeId": "b977-7c5e-33b2-428e"
                      },
                      {
                        "$text": "If this **Hero **is within the combat range of a friendly unit that is not a **Hero**:\n• Subtract 1 from hit rolls for shooting attacks that target this Hero.\n• If this **Hero **is **Infantry**, they cannot be picked as the target of shooting attacks made by models more than 12\" from them.",
                        "name": "Effect",
                        "typeId": "fd7f-888d-3257-a12b"
                      }
                    ],
                    "attributes": [
                      {
                        "$text": "Black",
                        "name": "Color",
                        "typeId": "50fe-4f29-6bc3-dcc6"
                      },
                      {
                        "$text": "Defensive",
                        "name": "Type",
                        "typeId": "bf11-4e10-3ab1-06f4"
                      },
                      {
                        "name": "Parent Node",
                        "typeId": "e2e1-15ca-d345-22b8"
                      }
                    ],
                    "id": "3bc-444a-5cf8-e4d",
                    "name": "Guarded Hero",
                    "hidden": false,
                    "typeId": "907f-a48-6a04-f788",
                    "typeName": "Ability (Passive)",
                    "from": "entry"
                  },
                  {
                    "characteristics": [
                      {
                        "name": "Keywords",
                        "typeId": "b977-7c5e-33b2-428e"
                      },
                      {
                        "$text": "In step 1 of the damage sequence (see 18.0), make a **ward roll **of D6 for each **damage point **in this unit’s **damage pool**. If the roll equals or exceeds this unit’s **ward value**, remove that damage point from the damage pool.",
                        "name": "Effect",
                        "typeId": "fd7f-888d-3257-a12b"
                      }
                    ],
                    "attributes": [
                      {
                        "$text": "Black",
                        "name": "Color",
                        "typeId": "50fe-4f29-6bc3-dcc6"
                      },
                      {
                        "$text": "Defensive",
                        "name": "Type",
                        "typeId": "bf11-4e10-3ab1-06f4"
                      },
                      {
                        "name": "Parent Node",
                        "typeId": "e2e1-15ca-d345-22b8"
                      }
                    ],
                    "id": "ed70-f30-2f5a-747f",
                    "name": "Ward Save",
                    "hidden": false,
                    "typeId": "907f-a48-6a04-f788",
                    "typeName": "Ability (Passive)",
                    "from": "entry"
                  }
                ],
                "selections": [
                  {
                    "selections": [
                      {
                        "profiles": [
                          {
                            "characteristics": [
                              {
                                "$text": "5",
                                "name": "Atk",
                                "typeId": "60e-35aa-31ed-e488"
                              },
                              {
                                "$text": "3+",
                                "name": "Hit",
                                "typeId": "26dc-168-b2fd-cb93"
                              },
                              {
                                "$text": "4+",
                                "name": "Wnd",
                                "typeId": "61c1-22cc-40af-2847"
                              },
                              {
                                "$text": "1",
                                "name": "Rnd",
                                "typeId": "eccc-10fa-6958-fb73"
                              },
                              {
                                "$text": "2",
                                "name": "Dmg",
                                "typeId": "e948-9c71-12a6-6be4"
                              },
                              {
                                "$text": "-",
                                "name": "Ability",
                                "typeId": "eda3-7332-5db1-4159"
                              }
                            ],
                            "id": "4d78-78ff-fb74-b49f",
                            "name": "Exquisite Scimitar",
                            "hidden": false,
                            "typeId": "9074-76b6-9e2f-81e3",
                            "typeName": "Melee Weapon",
                            "from": "entry"
                          }
                        ],
                        "id": "q84rvca",
                        "name": "Exquisite Scimitar",
                        "entryId": "e120-58a7-b8ef-ab66::1725-5e7b-8731-d9c9",
                        "number": 1,
                        "type": "upgrade",
                        "from": "entry"
                      }
                    ],
                    "id": "q2a6o8j",
                    "name": "Lord of Hubris",
                    "entryId": "e120-58a7-b8ef-ab66::40d7-2f23-9a21-7c01",
                    "number": 1,
                    "type": "model",
                    "from": "entry"
                  },
                  {
                    "profiles": [
                      {
                        "characteristics": [
                          {
                            "$text": "Once Per Battle, Any Combat Phase",
                            "name": "Timing",
                            "typeId": "652c-3d84-4e7-14f4"
                          },
                          {
                            "name": "Declare",
                            "typeId": "bad3-f9c5-ba46-18cb"
                          },
                          {
                            "$text": "For the rest of the turn, subtract 1 from the Attacks characteristic of melee weapons used by enemy units while they are in combat with this unit.",
                            "name": "Effect",
                            "typeId": "b6f1-ba36-6cd-3b03"
                          },
                          {
                            "name": "Keywords",
                            "typeId": "12e8-3214-7d8f-1d0f"
                          },
                          {
                            "name": "Used By",
                            "typeId": "1b32-c9d6-3106-166b"
                          }
                        ],
                        "attributes": [
                          {
                            "$text": "Red",
                            "name": "Color",
                            "typeId": "5a11-eab3-180c-ddf5"
                          },
                          {
                            "$text": "Defensive",
                            "name": "Type",
                            "typeId": "6d16-c86b-2698-85a4"
                          },
                          {
                            "name": "Parent Node",
                            "typeId": "2d74-4dcd-8468-87fa"
                          }
                        ],
                        "id": "1e95-1a75-154b-6d17",
                        "name": "Threnody Voicebox",
                        "hidden": false,
                        "typeId": "59b6-d47a-a68a-5dcc",
                        "typeName": "Ability (Activated)",
                        "from": "entry"
                      }
                    ],
                    "id": "q6mv26",
                    "name": "Threnody Voicebox",
                    "entryId": "273c-cb07-4ca3-e083::8b0b-791a-7873-1a61",
                    "entryGroupId": "273c-cb07-4ca3-e083::c782-bf56-82c4-458e",
                    "number": 1,
                    "type": "upgrade",
                    "from": "group",
                    "group": "Artefacts of Power::Coveted Treasures"
                  },
                  {
                    "profiles": [
                      {
                        "characteristics": [
                          {
                            "$text": "Once Per Battle, Your Movement Phase",
                            "name": "Timing",
                            "typeId": "736-6e3a-d0b5-a1b0"
                          },
                          {
                            "$text": "1",
                            "name": "Cost",
                            "typeId": "a49e-3082-e2a6-e802"
                          },
                          {
                            "$text": "Pick a friendly non-**Hero Sybarite** unit that has been destroyed to be the target.",
                            "name": "Declare",
                            "typeId": "b77f-7548-840e-c086"
                          },
                          {
                            "$text": "Set up a replacement unit with half the number of models from the target unit (rounding up) wholly within 12\" of this unit and more than 9\" from all enemy units.",
                            "name": "Effect",
                            "typeId": "2111-3ca8-61dd-a5f0"
                          },
                          {
                            "name": "Keywords",
                            "typeId": "445d-f443-5448-e7ce"
                          }
                        ],
                        "attributes": [
                          {
                            "$text": "Gray",
                            "name": "Color",
                            "typeId": "5c69-e4b9-19bc-e801"
                          },
                          {
                            "$text": "Rallying",
                            "name": "Type",
                            "typeId": "2bd5-08f1-f3d1-86f7"
                          },
                          {
                            "name": "Parent Node",
                            "typeId": "df75-e7dc-12b5-48a8"
                          }
                        ],
                        "id": "8d98-f250-278f-6375",
                        "name": "Celebrity Warlord",
                        "hidden": false,
                        "typeId": "55ac-f837-dded-5872",
                        "typeName": "Ability (Command)",
                        "from": "entry"
                      }
                    ],
                    "id": "q4wus1x",
                    "name": "Celebrity Warlord",
                    "entryId": "76f4-bec-a868-eda1::a759-a125-4840-f353",
                    "entryGroupId": "76f4-bec-a868-eda1::ddd8-a70f-9706-3bb8",
                    "number": 1,
                    "type": "upgrade",
                    "from": "group",
                    "group": "Heroic Traits::Hedonistic Obsessions"
                  }
                ],
                "costs": [
                  {
                    "name": "pts",
                    "typeId": "points",
                    "value": 100
                  }
                ],
                "categories": [
                  {
                    "id": "6e72-1656-d554-528a",
                    "name": "HERO",
                    "entryId": "6e72-1656-d554-528a",
                    "primary": false
                  },
                  {
                    "id": "319b-38ee-d10d-e800",
                    "name": "CHAOS",
                    "entryId": "319b-38ee-d10d-e800",
                    "primary": false
                  },
                  {
                    "id": "67df-cdfb-d83f-3197",
                    "name": "HEDONITES OF SLAANESH",
                    "entryId": "67df-cdfb-d83f-3197",
                    "primary": false
                  },
                  {
                    "id": "75d6-6995-dfcc-3898",
                    "name": "INFANTRY",
                    "entryId": "75d6-6995-dfcc-3898",
                    "primary": false
                  },
                  {
                    "id": "9a4b-cd0b-84e1-16c5",
                    "name": "SYBARITE",
                    "entryId": "9a4b-cd0b-84e1-16c5",
                    "primary": false
                  },
                  {
                    "id": "52cc-95fd-6cd3-8f72",
                    "name": "WARD (5+)",
                    "entryId": "52cc-95fd-6cd3-8f72",
                    "primary": false
                  },
                  {
                    "id": "db3a-7199-c92e-f3cf",
                    "name": "Regimental Option",
                    "entryId": "db3a-7199-c92e-f3cf",
                    "primary": false
                  },
                  {
                    "id": "d1f3-921c-b403-1106",
                    "entryId": "d1f3-921c-b403-1106",
                    "name": "Regimental Leader",
                    "primary": true
                  }
                ],
                "id": "q1jruw2",
                "name": "Lord of Hubris",
                "entryId": "e120-58a7-b8ef-ab66::ef1b-a791-66b4-735f",
                "number": 1,
                "type": "unit",
                "from": "entry"
              },
              {
                "profiles": [
                  {
                    "characteristics": [
                      {
                        "$text": "6\"",
                        "name": "Move",
                        "typeId": "fed0-d1b3-1bb8-c501"
                      },
                      {
                        "$text": "3",
                        "name": "Health",
                        "typeId": "96be-54ae-ce7b-10b7"
                      },
                      {
                        "$text": "5+",
                        "name": "Save",
                        "typeId": "1981-ef09-96f6-7aa9"
                      },
                      {
                        "$text": "1",
                        "name": "Control",
                        "typeId": "6c6f-8510-9ce1-fc6e"
                      }
                    ],
                    "id": "ea34-737c-3698-c1e8",
                    "name": "Slaangor Fiendbloods",
                    "hidden": false,
                    "typeId": "ff03-376e-972f-8ab2",
                    "typeName": "Unit",
                    "from": "entry"
                  },
                  {
                    "characteristics": [
                      {
                        "$text": "Deployment Phase",
                        "name": "Timing",
                        "typeId": "652c-3d84-4e7-14f4"
                      },
                      {
                        "$text": "Pick this unit if it has not been deployed.",
                        "name": "Declare",
                        "typeId": "bad3-f9c5-ba46-18cb"
                      },
                      {
                        "$text": "Set up this unit in reserve waiting in ambush. It has now been deployed.",
                        "name": "Effect",
                        "typeId": "b6f1-ba36-6cd-3b03"
                      },
                      {
                        "$text": "**Deploy**",
                        "name": "Keywords",
                        "typeId": "12e8-3214-7d8f-1d0f"
                      },
                      {
                        "name": "Used By",
                        "typeId": "1b32-c9d6-3106-166b"
                      }
                    ],
                    "attributes": [
                      {
                        "$text": "Black",
                        "name": "Color",
                        "typeId": "5a11-eab3-180c-ddf5"
                      },
                      {
                        "$text": "Special",
                        "name": "Type",
                        "typeId": "6d16-c86b-2698-85a4"
                      },
                      {
                        "name": "Parent Node",
                        "typeId": "2d74-4dcd-8468-87fa"
                      }
                    ],
                    "id": "011e-21ef-4971-1ee1",
                    "name": "Veiled Threat",
                    "hidden": false,
                    "typeId": "59b6-d47a-a68a-5dcc",
                    "typeName": "Ability (Activated)",
                    "from": "entry"
                  },
                  {
                    "characteristics": [
                      {
                        "$text": "Any Movement Phase",
                        "name": "Timing",
                        "typeId": "652c-3d84-4e7-14f4"
                      },
                      {
                        "$text": "Pick this unit if it is **waiting in ambush**.",
                        "name": "Declare",
                        "typeId": "bad3-f9c5-ba46-18cb"
                      },
                      {
                        "$text": "Set up this unit on the battlefield wholly within 9\" of a battlefield edge and more than 9\" from all enemy units.",
                        "name": "Effect",
                        "typeId": "b6f1-ba36-6cd-3b03"
                      },
                      {
                        "name": "Keywords",
                        "typeId": "12e8-3214-7d8f-1d0f"
                      },
                      {
                        "name": "Used By",
                        "typeId": "1b32-c9d6-3106-166b"
                      }
                    ],
                    "attributes": [
                      {
                        "$text": "Gray",
                        "name": "Color",
                        "typeId": "5a11-eab3-180c-ddf5"
                      },
                      {
                        "$text": "Movement",
                        "name": "Type",
                        "typeId": "6d16-c86b-2698-85a4"
                      },
                      {
                        "name": "Parent Node",
                        "typeId": "2d74-4dcd-8468-87fa"
                      }
                    ],
                    "id": "aa8e-3cbb-0c5b-6eef",
                    "name": "Bestial Onslaught",
                    "hidden": false,
                    "typeId": "59b6-d47a-a68a-5dcc",
                    "typeName": "Ability (Activated)",
                    "from": "entry"
                  },
                  {
                    "characteristics": [
                      {
                        "$text": "Once Per Phase (Army), Reaction: Opponent declared a command for a unit within 12\" of this unit",
                        "name": "Timing",
                        "typeId": "652c-3d84-4e7-14f4"
                      },
                      {
                        "name": "Declare",
                        "typeId": "bad3-f9c5-ba46-18cb"
                      },
                      {
                        "$text": "This unit can move up to 3\" immediately after that command has been resolved, unless that command is a reaction, in which case this unit can move after the ability that it was reacting to has been resolved. That move can pass through the combat ranges of enemy units, and can end in combat.",
                        "name": "Effect",
                        "typeId": "b6f1-ba36-6cd-3b03"
                      },
                      {
                        "name": "Keywords",
                        "typeId": "12e8-3214-7d8f-1d0f"
                      },
                      {
                        "name": "Used By",
                        "typeId": "1b32-c9d6-3106-166b"
                      }
                    ],
                    "attributes": [
                      {
                        "$text": "Black",
                        "name": "Color",
                        "typeId": "5a11-eab3-180c-ddf5"
                      },
                      {
                        "$text": "Movement",
                        "name": "Type",
                        "typeId": "6d16-c86b-2698-85a4"
                      },
                      {
                        "name": "Parent Node",
                        "typeId": "2d74-4dcd-8468-87fa"
                      }
                    ],
                    "id": "e585-f2f2-5809-5a1b",
                    "name": "Instinctive Advance",
                    "hidden": false,
                    "typeId": "59b6-d47a-a68a-5dcc",
                    "typeName": "Ability (Activated)",
                    "from": "entry"
                  }
                ],
                "selections": [
                  {
                    "id": "pnbn55h",
                    "name": "Reinforced",
                    "entryId": "b71e-c7e7-0b35-3b28::1b37-82b8-c062-eb82",
                    "number": 1,
                    "type": "upgrade",
                    "from": "entry"
                  },
                  {
                    "selections": [
                      {
                        "profiles": [
                          {
                            "characteristics": [
                              {
                                "$text": "4",
                                "name": "Atk",
                                "typeId": "60e-35aa-31ed-e488"
                              },
                              {
                                "$text": "4+",
                                "name": "Hit",
                                "typeId": "26dc-168-b2fd-cb93"
                              },
                              {
                                "$text": "3+",
                                "name": "Wnd",
                                "typeId": "61c1-22cc-40af-2847"
                              },
                              {
                                "$text": "1",
                                "name": "Rnd",
                                "typeId": "eccc-10fa-6958-fb73"
                              },
                              {
                                "$text": "2",
                                "name": "Dmg",
                                "typeId": "e948-9c71-12a6-6be4"
                              },
                              {
                                "$text": "Charge (+1 Damage)",
                                "name": "Ability",
                                "typeId": "eda3-7332-5db1-4159"
                              }
                            ],
                            "id": "b530-0449-68a6-e1f2",
                            "name": "Razor-sharp Claws and Gilded Weapons",
                            "hidden": false,
                            "typeId": "9074-76b6-9e2f-81e3",
                            "typeName": "Melee Weapon",
                            "from": "entry"
                          }
                        ],
                        "id": "pp3ijtu",
                        "name": "Razor-sharp Claws and Gilded Weapons",
                        "entryId": "0b5c-79f3-7a55-970a::da26-48fe-711d-e904",
                        "number": 1,
                        "type": "upgrade",
                        "from": "entry"
                      },
                      {
                        "profiles": [
                          {
                            "characteristics": [
                              {
                                "name": "Keywords",
                                "typeId": "b977-7c5e-33b2-428e"
                              },
                              {
                                "$text": "Add 1 to the Attacks characteristic of weapons used by champions in this unit.",
                                "name": "Effect",
                                "typeId": "fd7f-888d-3257-a12b"
                              }
                            ],
                            "attributes": [
                              {
                                "$text": "Red",
                                "name": "Color",
                                "typeId": "50fe-4f29-6bc3-dcc6"
                              },
                              {
                                "$text": "Offensive",
                                "name": "Type",
                                "typeId": "bf11-4e10-3ab1-06f4"
                              },
                              {
                                "name": "Parent Node",
                                "typeId": "e2e1-15ca-d345-22b8"
                              }
                            ],
                            "id": "6ba-36a4-3848-65d1",
                            "name": "Champion",
                            "hidden": false,
                            "typeId": "907f-a48-6a04-f788",
                            "typeName": "Ability (Passive)",
                            "from": "entry"
                          }
                        ],
                        "categories": [
                          {
                            "id": "9c77-5e0b-a20f-d885",
                            "name": "Command Model",
                            "entryId": "9c77-5e0b-a20f-d885",
                            "primary": false
                          }
                        ],
                        "id": "ppp308p",
                        "name": "Champion",
                        "entryId": "0b5c-79f3-7a55-970a::22f6-f178-6250-bb74::9c21-1746-9873-a5b5",
                        "entryGroupId": "0b5c-79f3-7a55-970a::a7fe-2634-27fc-48b0",
                        "number": 1,
                        "type": "upgrade",
                        "from": "group",
                        "group": "Command Models"
                      }
                    ],
                    "id": "postu8j",
                    "name": "Slaangor Fiendblood",
                    "entryId": "0b5c-79f3-7a55-970a::cc7a-582a-b277-953b",
                    "number": 1,
                    "type": "model",
                    "from": "entry"
                  },
                  {
                    "selections": [
                      {
                        "profiles": [
                          {
                            "characteristics": [
                              {
                                "$text": "4",
                                "name": "Atk",
                                "typeId": "60e-35aa-31ed-e488"
                              },
                              {
                                "$text": "4+",
                                "name": "Hit",
                                "typeId": "26dc-168-b2fd-cb93"
                              },
                              {
                                "$text": "3+",
                                "name": "Wnd",
                                "typeId": "61c1-22cc-40af-2847"
                              },
                              {
                                "$text": "1",
                                "name": "Rnd",
                                "typeId": "eccc-10fa-6958-fb73"
                              },
                              {
                                "$text": "2",
                                "name": "Dmg",
                                "typeId": "e948-9c71-12a6-6be4"
                              },
                              {
                                "$text": "Charge (+1 Damage)",
                                "name": "Ability",
                                "typeId": "eda3-7332-5db1-4159"
                              }
                            ],
                            "id": "b530-0449-68a6-e1f2",
                            "name": "Razor-sharp Claws and Gilded Weapons",
                            "hidden": false,
                            "typeId": "9074-76b6-9e2f-81e3",
                            "typeName": "Melee Weapon",
                            "from": "entry"
                          }
                        ],
                        "id": "pqj2bjh",
                        "name": "Razor-sharp Claws and Gilded Weapons",
                        "entryId": "0b5c-79f3-7a55-970a::da26-48fe-711d-e904",
                        "number": 5,
                        "type": "upgrade",
                        "from": "entry"
                      }
                    ],
                    "id": "pp004hz",
                    "name": "Slaangor Fiendblood",
                    "entryId": "0b5c-79f3-7a55-970a::cc7a-582a-b277-953b",
                    "number": 5,
                    "type": "model",
                    "from": "entry"
                  }
                ],
                "costs": [
                  {
                    "name": "pts",
                    "typeId": "points",
                    "value": 300
                  }
                ],
                "categories": [
                  {
                    "id": "67df-cdfb-d83f-3197",
                    "name": "HEDONITES OF SLAANESH",
                    "entryId": "67df-cdfb-d83f-3197",
                    "primary": false
                  },
                  {
                    "id": "319b-38ee-d10d-e800",
                    "name": "CHAOS",
                    "entryId": "319b-38ee-d10d-e800",
                    "primary": false
                  },
                  {
                    "id": "f679-3bcb-d664-9ac3",
                    "name": "CHAMPION",
                    "entryId": "f679-3bcb-d664-9ac3",
                    "primary": false
                  },
                  {
                    "id": "75d6-6995-dfcc-3898",
                    "entryId": "75d6-6995-dfcc-3898",
                    "name": "INFANTRY",
                    "primary": true
                  },
                  {
                    "id": "9a4b-cd0b-84e1-16c5",
                    "name": "SYBARITE",
                    "entryId": "9a4b-cd0b-84e1-16c5",
                    "primary": false
                  },
                  {
                    "id": "db3a-7199-c92e-f3cf",
                    "name": "Regimental Option",
                    "entryId": "db3a-7199-c92e-f3cf",
                    "primary": false
                  }
                ],
                "id": "pm3jy8n",
                "name": "Slaangor Fiendbloods (Scourge of Ghyran)",
                "entryId": "0b5c-79f3-7a55-970a::3e9a-0e86-a7fa-ec3d",
                "number": 1,
                "type": "unit",
                "from": "entry"
              },
              {
                "profiles": [
                  {
                    "characteristics": [
                      {
                        "$text": "12\"",
                        "name": "Move",
                        "typeId": "fed0-d1b3-1bb8-c501"
                      },
                      {
                        "$text": "4",
                        "name": "Health",
                        "typeId": "96be-54ae-ce7b-10b7"
                      },
                      {
                        "$text": "5+",
                        "name": "Save",
                        "typeId": "1981-ef09-96f6-7aa9"
                      },
                      {
                        "$text": "1",
                        "name": "Control",
                        "typeId": "6c6f-8510-9ce1-fc6e"
                      }
                    ],
                    "id": "a664-8f72-d589-9289",
                    "name": "Slickblade Seekers",
                    "hidden": false,
                    "typeId": "ff03-376e-972f-8ab2",
                    "typeName": "Unit",
                    "from": "entry"
                  },
                  {
                    "characteristics": [
                      {
                        "name": "Keywords",
                        "typeId": "b977-7c5e-33b2-428e"
                      },
                      {
                        "$text": "You can re-roll charge rolls for this unit.",
                        "name": "Effect",
                        "typeId": "fd7f-888d-3257-a12b"
                      }
                    ],
                    "attributes": [
                      {
                        "$text": "Orange",
                        "name": "Color",
                        "typeId": "50fe-4f29-6bc3-dcc6"
                      },
                      {
                        "$text": "Movement",
                        "name": "Type",
                        "typeId": "bf11-4e10-3ab1-06f4"
                      },
                      {
                        "name": "Parent Node",
                        "typeId": "e2e1-15ca-d345-22b8"
                      }
                    ],
                    "id": "8ac5-5bbf-1b9f-924a",
                    "name": "Unrivalled Velocity",
                    "hidden": false,
                    "typeId": "907f-a48-6a04-f788",
                    "typeName": "Ability (Passive)",
                    "from": "entry"
                  }
                ],
                "selections": [
                  {
                    "id": "d7syfxi",
                    "name": "Reinforced",
                    "entryId": "e317-f6d9-92d6-8c2c::1b37-82b8-c062-eb82",
                    "number": 1,
                    "type": "upgrade",
                    "from": "entry"
                  },
                  {
                    "selections": [
                      {
                        "profiles": [
                          {
                            "characteristics": [
                              {
                                "$text": "3",
                                "name": "Atk",
                                "typeId": "60e-35aa-31ed-e488"
                              },
                              {
                                "$text": "3+",
                                "name": "Hit",
                                "typeId": "26dc-168-b2fd-cb93"
                              },
                              {
                                "$text": "4+",
                                "name": "Wnd",
                                "typeId": "61c1-22cc-40af-2847"
                              },
                              {
                                "$text": "-",
                                "name": "Rnd",
                                "typeId": "eccc-10fa-6958-fb73"
                              },
                              {
                                "$text": "1",
                                "name": "Dmg",
                                "typeId": "e948-9c71-12a6-6be4"
                              },
                              {
                                "$text": "Companion",
                                "name": "Ability",
                                "typeId": "eda3-7332-5db1-4159"
                              }
                            ],
                            "id": "c05d-5278-60a5-bc9d",
                            "name": "Exalted Steed’s Poisoned Tongue",
                            "hidden": false,
                            "typeId": "9074-76b6-9e2f-81e3",
                            "typeName": "Melee Weapon",
                            "from": "entry"
                          }
                        ],
                        "id": "d9gsltr",
                        "name": "Exalted Steed’s Poisoned Tongue",
                        "entryId": "abb6-eea9-4ae3-cbd5::ecb8-a522-77e6-96b4",
                        "number": 1,
                        "type": "upgrade",
                        "from": "entry"
                      },
                      {
                        "profiles": [
                          {
                            "characteristics": [
                              {
                                "$text": "3",
                                "name": "Atk",
                                "typeId": "60e-35aa-31ed-e488"
                              },
                              {
                                "$text": "3+",
                                "name": "Hit",
                                "typeId": "26dc-168-b2fd-cb93"
                              },
                              {
                                "$text": "4+",
                                "name": "Wnd",
                                "typeId": "61c1-22cc-40af-2847"
                              },
                              {
                                "$text": "1",
                                "name": "Rnd",
                                "typeId": "eccc-10fa-6958-fb73"
                              },
                              {
                                "$text": "1",
                                "name": "Dmg",
                                "typeId": "e948-9c71-12a6-6be4"
                              },
                              {
                                "$text": "Charge (+1 Damage)",
                                "name": "Ability",
                                "typeId": "eda3-7332-5db1-4159"
                              }
                            ],
                            "id": "2791-92f2-3d77-150f",
                            "name": "Slickblade Glaive",
                            "hidden": false,
                            "typeId": "9074-76b6-9e2f-81e3",
                            "typeName": "Melee Weapon",
                            "from": "entry"
                          }
                        ],
                        "id": "d9adu8",
                        "name": "Slickblade Glaive",
                        "entryId": "abb6-eea9-4ae3-cbd5::9ab6-29dc-f8bd-f053",
                        "number": 1,
                        "type": "upgrade",
                        "from": "entry"
                      },
                      {
                        "profiles": [
                          {
                            "characteristics": [
                              {
                                "name": "Keywords",
                                "typeId": "b977-7c5e-33b2-428e"
                              },
                              {
                                "$text": "Add 1 to the Attacks characteristic of weapons used by champions in this unit.",
                                "name": "Effect",
                                "typeId": "fd7f-888d-3257-a12b"
                              }
                            ],
                            "attributes": [
                              {
                                "$text": "Red",
                                "name": "Color",
                                "typeId": "50fe-4f29-6bc3-dcc6"
                              },
                              {
                                "$text": "Offensive",
                                "name": "Type",
                                "typeId": "bf11-4e10-3ab1-06f4"
                              },
                              {
                                "name": "Parent Node",
                                "typeId": "e2e1-15ca-d345-22b8"
                              }
                            ],
                            "id": "6ba-36a4-3848-65d1",
                            "name": "Champion",
                            "hidden": false,
                            "typeId": "907f-a48-6a04-f788",
                            "typeName": "Ability (Passive)",
                            "from": "entry"
                          }
                        ],
                        "categories": [
                          {
                            "id": "9c77-5e0b-a20f-d885",
                            "name": "Command Model",
                            "entryId": "9c77-5e0b-a20f-d885",
                            "primary": false
                          }
                        ],
                        "id": "d97db6c",
                        "name": "Champion",
                        "entryId": "abb6-eea9-4ae3-cbd5::d3d0-3fad-b1a-a1bc::9c21-1746-9873-a5b5",
                        "entryGroupId": "abb6-eea9-4ae3-cbd5::ace0-f42f-9b43-7733",
                        "number": 1,
                        "type": "upgrade",
                        "from": "group",
                        "group": "Command Models"
                      }
                    ],
                    "id": "d8l3he",
                    "name": "Slickblade Seeker",
                    "entryId": "abb6-eea9-4ae3-cbd5::10c3-496c-ce73-fbec",
                    "number": 1,
                    "type": "model",
                    "from": "entry"
                  },
                  {
                    "selections": [
                      {
                        "profiles": [
                          {
                            "characteristics": [
                              {
                                "$text": "3",
                                "name": "Atk",
                                "typeId": "60e-35aa-31ed-e488"
                              },
                              {
                                "$text": "3+",
                                "name": "Hit",
                                "typeId": "26dc-168-b2fd-cb93"
                              },
                              {
                                "$text": "4+",
                                "name": "Wnd",
                                "typeId": "61c1-22cc-40af-2847"
                              },
                              {
                                "$text": "-",
                                "name": "Rnd",
                                "typeId": "eccc-10fa-6958-fb73"
                              },
                              {
                                "$text": "1",
                                "name": "Dmg",
                                "typeId": "e948-9c71-12a6-6be4"
                              },
                              {
                                "$text": "Companion",
                                "name": "Ability",
                                "typeId": "eda3-7332-5db1-4159"
                              }
                            ],
                            "id": "c05d-5278-60a5-bc9d",
                            "name": "Exalted Steed’s Poisoned Tongue",
                            "hidden": false,
                            "typeId": "9074-76b6-9e2f-81e3",
                            "typeName": "Melee Weapon",
                            "from": "entry"
                          }
                        ],
                        "id": "dbqe2xk",
                        "name": "Exalted Steed’s Poisoned Tongue",
                        "entryId": "abb6-eea9-4ae3-cbd5::ecb8-a522-77e6-96b4",
                        "number": 9,
                        "type": "upgrade",
                        "from": "entry"
                      },
                      {
                        "profiles": [
                          {
                            "characteristics": [
                              {
                                "$text": "3",
                                "name": "Atk",
                                "typeId": "60e-35aa-31ed-e488"
                              },
                              {
                                "$text": "3+",
                                "name": "Hit",
                                "typeId": "26dc-168-b2fd-cb93"
                              },
                              {
                                "$text": "4+",
                                "name": "Wnd",
                                "typeId": "61c1-22cc-40af-2847"
                              },
                              {
                                "$text": "1",
                                "name": "Rnd",
                                "typeId": "eccc-10fa-6958-fb73"
                              },
                              {
                                "$text": "1",
                                "name": "Dmg",
                                "typeId": "e948-9c71-12a6-6be4"
                              },
                              {
                                "$text": "Charge (+1 Damage)",
                                "name": "Ability",
                                "typeId": "eda3-7332-5db1-4159"
                              }
                            ],
                            "id": "2791-92f2-3d77-150f",
                            "name": "Slickblade Glaive",
                            "hidden": false,
                            "typeId": "9074-76b6-9e2f-81e3",
                            "typeName": "Melee Weapon",
                            "from": "entry"
                          }
                        ],
                        "id": "db3zzum",
                        "name": "Slickblade Glaive",
                        "entryId": "abb6-eea9-4ae3-cbd5::9ab6-29dc-f8bd-f053",
                        "number": 9,
                        "type": "upgrade",
                        "from": "entry"
                      }
                    ],
                    "id": "dapwzq8",
                    "name": "Slickblade Seeker",
                    "entryId": "abb6-eea9-4ae3-cbd5::10c3-496c-ce73-fbec",
                    "number": 9,
                    "type": "model",
                    "from": "entry"
                  }
                ],
                "costs": [
                  {
                    "name": "pts",
                    "typeId": "points",
                    "value": 360
                  }
                ],
                "categories": [
                  {
                    "id": "67df-cdfb-d83f-3197",
                    "name": "HEDONITES OF SLAANESH",
                    "entryId": "67df-cdfb-d83f-3197",
                    "primary": false
                  },
                  {
                    "id": "319b-38ee-d10d-e800",
                    "name": "CHAOS",
                    "entryId": "319b-38ee-d10d-e800",
                    "primary": false
                  },
                  {
                    "id": "f679-3bcb-d664-9ac3",
                    "name": "CHAMPION",
                    "entryId": "f679-3bcb-d664-9ac3",
                    "primary": false
                  },
                  {
                    "id": "9a4b-cd0b-84e1-16c5",
                    "name": "SYBARITE",
                    "entryId": "9a4b-cd0b-84e1-16c5",
                    "primary": false
                  },
                  {
                    "id": "926c-df8c-6841-d49e",
                    "entryId": "926c-df8c-6841-d49e",
                    "name": "CAVALRY",
                    "primary": true
                  },
                  {
                    "id": "db3a-7199-c92e-f3cf",
                    "name": "Regimental Option",
                    "entryId": "db3a-7199-c92e-f3cf",
                    "primary": false
                  }
                ],
                "id": "d1ikszt7",
                "name": "Slickblade Seekers",
                "entryId": "abb6-eea9-4ae3-cbd5::395d-b625-25a4-4ca2",
                "number": 1,
                "type": "unit",
                "from": "entry"
              }
            ],
            "categories": [
              {
                "name": "Uncategorized",
                "id": "p9iwpdq",
                "primary": false,
                "entryId": "(No Category)"
              },
              {
                "name": "Regimental Leader",
                "id": "qrgdxsb",
                "primary": false,
                "entryId": "d1f3-921c-b403-1106"
              },
              {
                "name": "HERO",
                "id": "pad1dv",
                "primary": false,
                "entryId": "6e72-1656-d554-528a"
              },
              {
                "name": "INFANTRY",
                "id": "qs56loq",
                "primary": false,
                "entryId": "75d6-6995-dfcc-3898"
              },
              {
                "name": "MONSTER",
                "id": "pan995",
                "primary": false,
                "entryId": "6d54-625c-d063-13e2"
              },
              {
                "name": "WAR MACHINE",
                "id": "pal9zv",
                "primary": false,
                "entryId": "f7bc-b618-4b5d-2bae"
              },
              {
                "name": "CAVALRY",
                "id": "qsjnako",
                "primary": false,
                "entryId": "926c-df8c-6841-d49e"
              },
              {
                "name": "BEAST",
                "id": "pa83hs",
                "primary": false,
                "entryId": "b224-8c8e-ca93-9860"
              },
              {
                "name": "Illegal Units",
                "id": "pa735dd",
                "primary": false,
                "entryId": "(Illegal Units)"
              }
            ],
            "id": "qq9w69n",
            "name": "Regiment",
            "entryId": "48a1-e075-c797-5605::376a-6b97-8699-dd59",
            "catalogueId": "afdb-68a1-283e-3bf2",
            "catalogueRevision": 28,
            "catalogueName": "Hedonites of Slaanesh"
          }
        ],
        "id": "3cqzu7",
        "name": "✦ General's Handbook 2025-26",
        "entryId": "f079-501a-2738-6845",
        "catalogueId": "afdb-68a1-283e-3bf2",
        "catalogueRevision": 28,
        "catalogueName": "Hedonites of Slaanesh"
      }
    ],
    "id": "30w579p",
    "name": "Fun fun tummy",
    "battleScribeVersion": 2.03,
    "generatedBy": "https://newrecruit.eu",
    "gameSystemId": "e51d-b1a3-75fc-dc3g",
    "gameSystemName": "Age of Sigmar 4.0",
    "gameSystemRevision": 91,
    "xmlns": "http://www.battlescribe.net/schema/rosterSchema"
  }
};
