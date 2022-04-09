var accessTarget = $jSpaghetti.module("cleaners").sequence("accessTargetAndCleanLogs")

accessTarget.instructions = [
	//{"@tryToInvadeTarget": 	["hackTargetBruteForce", "isThereMessageError", {"jumpif": ["*.$", "@checkMessage"]}, "isThereProgressBar", {"jumpif": ["!*.$", "@accessTargetLogs"]}, "waitProgressBar", {"jumpif": [1, "@accessTarget"]}]},
	{"@tryToInvadeTarget": 	[{"wait": 800}, "hackTargetBruteForce", "waitProgressBar", {"jumpif": ["*.isThereMessageError","@checkMessage"]}, {"jumpif": [1, "@accessTarget"]}]},
	{"@checkMessage": 		["isAccessForbidden", {"jumpif": ["*.$", "@finish"]}]},
	{"@accessTarget": 		[{"wait": 800}, "goToLoginPage", {"wait": 800}, "signInTarget", {"jumpif": [1, "@cleanLogs"]}]},
	{"@accessTargetLogs": 	"goToTargetLogs"},
	{"@cleanLogs": 			["cleanMyIpClues", {"jumpif": ["(*.isEmpty) || (!*.$)", "@finish"]}, {"jumpif": ["!*.myCluesFound", "@finish"]}, "submitLogs", "waitProgressBar"]},
	{"@finish": 			[{"exit": 1}]}
]

