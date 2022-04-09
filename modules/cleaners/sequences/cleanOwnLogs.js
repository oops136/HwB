var cleanOwnLogs = $jSpaghetti.module("cleaners").sequence("cleanOwnLogs")

cleanOwnLogs.instructions = [
	{"@init": 	[{"wait": 760},"goToOwnLogTab", "cleanTextAreaContent", {"jumpif": ["*.isEmpty == true", "@finish"]}, "waitProgressBar"]},
	{"@finish": {"exit": 1}}
]