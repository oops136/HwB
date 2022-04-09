var cleanTargetLogs = $jSpaghetti.module("cleaners").sequence("cleanTargetLogs")

cleanTargetLogs.instructions = [
	{"@init": 	[{"wait": 760},"goToTargetLogs", "cleanMyIpClues", {"jumpif": ["(*.isEmpty) || (!*.$)", "@finish"]}, {"jumpif": ["!*.myCluesFound", "@finish"]}, "submitLogs", "waitProgressBar"]},
	{"@finish": {"exit": 1}}
]