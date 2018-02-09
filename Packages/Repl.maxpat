{
	"patcher" : 	{
		"fileversion" : 1,
		"appversion" : 		{
			"major" : 6,
			"minor" : 1,
			"revision" : 10,
			"architecture" : "x86"
		}
,
		"rect" : [ 847.0, 332.0, 640.0, 480.0 ],
		"bglocked" : 0,
		"openinpresentation" : 1,
		"default_fontsize" : 12.0,
		"default_fontface" : 0,
		"default_fontname" : "Arial",
		"gridonopen" : 0,
		"gridsize" : [ 15.0, 15.0 ],
		"gridsnaponopen" : 0,
		"statusbarvisible" : 2,
		"toolbarvisible" : 1,
		"boxanimatetime" : 200,
		"imprint" : 0,
		"enablehscroll" : 1,
		"enablevscroll" : 1,
		"devicewidth" : 0.0,
		"description" : "",
		"digest" : "",
		"tags" : "",
		"boxes" : [ 			{
				"box" : 				{
					"fontname" : "Arial",
					"fontsize" : 12.0,
					"id" : "obj-5",
					"maxclass" : "newobj",
					"numinlets" : 1,
					"numoutlets" : 1,
					"outlettype" : [ "" ],
					"patching_rect" : [ 192.0, 285.0, 113.0, 20.0 ],
					"saved_object_attributes" : 					{
						"filename" : "noct.command.js",
						"parameter_enable" : 0
					}
,
					"text" : "js noct.command.js"
				}

			}
, 			{
				"box" : 				{
					"fontname" : "Arial",
					"fontsize" : 12.0,
					"id" : "obj-4",
					"maxclass" : "newobj",
					"numinlets" : 1,
					"numoutlets" : 1,
					"outlettype" : [ "" ],
					"patching_rect" : [ 192.0, 345.0, 113.0, 20.0 ],
					"saved_object_attributes" : 					{
						"filename" : "smp.command.js",
						"parameter_enable" : 0
					}
,
					"text" : "js smp.command.js"
				}

			}
, 			{
				"box" : 				{
					"fontname" : "Arial",
					"fontsize" : 12.0,
					"id" : "obj-3",
					"maxclass" : "newobj",
					"numinlets" : 1,
					"numoutlets" : 1,
					"outlettype" : [ "" ],
					"patching_rect" : [ 192.0, 325.0, 114.0, 20.0 ],
					"saved_object_attributes" : 					{
						"filename" : "orch.command.js",
						"parameter_enable" : 0
					}
,
					"text" : "js orch.command.js"
				}

			}
, 			{
				"box" : 				{
					"fontname" : "Arial",
					"fontsize" : 12.0,
					"id" : "obj-2",
					"maxclass" : "newobj",
					"numinlets" : 1,
					"numoutlets" : 1,
					"outlettype" : [ "" ],
					"patching_rect" : [ 192.0, 305.0, 110.0, 20.0 ],
					"saved_object_attributes" : 					{
						"filename" : "seq.command.js",
						"parameter_enable" : 0
					}
,
					"text" : "js seq.command.js"
				}

			}
, 			{
				"box" : 				{
					"fontname" : "Arial",
					"fontsize" : 12.0,
					"id" : "obj-1",
					"maxclass" : "newobj",
					"numinlets" : 1,
					"numoutlets" : 1,
					"outlettype" : [ "" ],
					"patching_rect" : [ 208.0, 126.0, 81.0, 20.0 ],
					"saved_object_attributes" : 					{
						"filename" : "repl.args.js",
						"parameter_enable" : 0
					}
,
					"text" : "js repl.args.js"
				}

			}
, 			{
				"box" : 				{
					"fontname" : "Arial",
					"fontsize" : 12.0,
					"frgb" : 0.0,
					"id" : "obj-11",
					"maxclass" : "comment",
					"numinlets" : 1,
					"numoutlets" : 0,
					"patching_rect" : [ 359.0, 257.0, 215.0, 20.0 ],
					"presentation" : 1,
					"presentation_rect" : [ 5.0, 47.0, 215.0, 20.0 ],
					"text" : "msmp -p seq -n 1 -i 0 -r 1 -c ezd"
				}

			}
, 			{
				"box" : 				{
					"fontname" : "Arial",
					"fontsize" : 12.0,
					"frgb" : 0.0,
					"id" : "obj-9",
					"maxclass" : "comment",
					"numinlets" : 1,
					"numoutlets" : 0,
					"patching_rect" : [ 359.0, 229.0, 150.0, 20.0 ],
					"presentation" : 1,
					"presentation_rect" : [ 5.0, 27.0, 150.0, 20.0 ],
					"text" : "mseq -v 4 -b 4 -r sr -s seq"
				}

			}
, 			{
				"box" : 				{
					"fontname" : "Arial",
					"fontsize" : 12.0,
					"id" : "obj-41",
					"maxclass" : "newobj",
					"numinlets" : 1,
					"numoutlets" : 1,
					"outlettype" : [ "" ],
					"patching_rect" : [ 60.0, 211.0, 55.0, 20.0 ],
					"saved_object_attributes" : 					{
						"filename" : "repl.js",
						"parameter_enable" : 0
					}
,
					"text" : "js repl.js"
				}

			}
, 			{
				"box" : 				{
					"fontname" : "Arial",
					"fontsize" : 13.0,
					"id" : "obj-37",
					"maxclass" : "newobj",
					"numinlets" : 2,
					"numoutlets" : 2,
					"outlettype" : [ "", "" ],
					"patching_rect" : [ 5.0, 176.0, 74.0, 21.0 ],
					"text" : "route bang"
				}

			}
, 			{
				"box" : 				{
					"fontname" : "Arial",
					"fontsize" : 13.0,
					"id" : "obj-38",
					"maxclass" : "newobj",
					"numinlets" : 1,
					"numoutlets" : 2,
					"outlettype" : [ "select", "clear" ],
					"patching_rect" : [ 5.0, 134.0, 120.0, 21.0 ],
					"text" : "trigger select clear"
				}

			}
, 			{
				"box" : 				{
					"fontname" : "Arial",
					"fontsize" : 13.0,
					"id" : "obj-39",
					"maxclass" : "newobj",
					"numinlets" : 2,
					"numoutlets" : 2,
					"outlettype" : [ "", "" ],
					"patching_rect" : [ 5.0, 155.0, 66.0, 21.0 ],
					"text" : "route text"
				}

			}
, 			{
				"box" : 				{
					"autoscroll" : 0,
					"bangmode" : 1,
					"fontname" : "Arial",
					"fontsize" : 13.0,
					"frgb" : 0.0,
					"id" : "obj-40",
					"keymode" : 1,
					"lines" : 1,
					"maxclass" : "textedit",
					"numinlets" : 1,
					"numoutlets" : 4,
					"outlettype" : [ "", "int", "", "" ],
					"parameter_enable" : 0,
					"patching_rect" : [ 5.0, 111.0, 174.0, 23.0 ],
					"presentation" : 1,
					"presentation_rect" : [ 5.0, 4.0, 174.0, 23.0 ],
					"tabmode" : 0
				}

			}
 ],
		"lines" : [ 			{
				"patchline" : 				{
					"destination" : [ "obj-38", 0 ],
					"disabled" : 0,
					"hidden" : 0,
					"source" : [ "obj-37", 1 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-41", 0 ],
					"disabled" : 0,
					"hidden" : 0,
					"source" : [ "obj-37", 1 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-40", 0 ],
					"disabled" : 0,
					"hidden" : 0,
					"source" : [ "obj-38", 1 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-40", 0 ],
					"disabled" : 0,
					"hidden" : 0,
					"source" : [ "obj-38", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-37", 0 ],
					"disabled" : 0,
					"hidden" : 0,
					"source" : [ "obj-39", 0 ]
				}

			}
, 			{
				"patchline" : 				{
					"destination" : [ "obj-39", 0 ],
					"disabled" : 0,
					"hidden" : 0,
					"source" : [ "obj-40", 0 ]
				}

			}
 ],
		"dependency_cache" : [ 			{
				"name" : "repl.js",
				"bootpath" : "/Users/trevsim/Personal/Max/js",
				"patcherrelativepath" : "../js",
				"type" : "TEXT",
				"implicit" : 1
			}
, 			{
				"name" : "repl.args.js",
				"bootpath" : "/Users/trevsim/Personal/Max/js",
				"patcherrelativepath" : "../js",
				"type" : "TEXT",
				"implicit" : 1
			}
, 			{
				"name" : "seq.command.js",
				"bootpath" : "/Users/trevsim/Personal/Max/js/seq",
				"patcherrelativepath" : "../js/seq",
				"type" : "TEXT",
				"implicit" : 1
			}
, 			{
				"name" : "orch.command.js",
				"bootpath" : "/Users/trevsim/Personal/Max/js/orch",
				"patcherrelativepath" : "../js/orch",
				"type" : "TEXT",
				"implicit" : 1
			}
, 			{
				"name" : "smp.command.js",
				"bootpath" : "/Users/trevsim/Personal/Max/js/smp",
				"patcherrelativepath" : "../js/smp",
				"type" : "TEXT",
				"implicit" : 1
			}
, 			{
				"name" : "noct.command.js",
				"bootpath" : "/Users/trevsim/Personal/Max/js/noct",
				"patcherrelativepath" : "../js/noct",
				"type" : "TEXT",
				"implicit" : 1
			}
 ]
	}

}
