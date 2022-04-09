var foo = $jSpaghetti.module("webcrawler").sequence("browseWeb")

foo.instructions = [
	{"@init": 						["startSearching", {"jumpif":["!*.$", "@finishProcess"]}]},
	{"@goToNextTarget": 			["createNewHost", {"wait": 800}, "logout", {"jumpif": ["*.openList.length == 0", "@finishProcess"]}, {"wait": 1000}, "goToNextIp", "isIpInvalid", {"jumpif": ["*.$", "@ignoreIp"]}, "ipDoesNotExist", {"jumpif": ["*.$", "@ignoreIp"]}, "getHostLabel", "registerNPCNamesList", "isThereMessageError", {"jumpif": ["*.$", "@accountInaccessibleHost"]}]},
	{"@tryToInvadeTarget": 			[{"wait": 200}, "forceToAccessTarget", "isThereMessageError", {"jumpif":["*.$", "@accessKnownTarget"]}, "hackTargetBruteForce", "isThereMessageError", {"jumpif":["*.$", "@accountInaccessibleHost"]}, "waitProgressBar"]},
	{"@accessKnownTarget": 			[{"wait": 400},"goToLoginPage", "signInTarget", "isThereMessageError", {"jumpif":["*.$", "@accountInaccessibleHost"]}, "registerAccessible", {"wait": 760}, "isThereLogs", "cleanMyIpClues", "submitLogs", "waitProgressBar"]},
	{"@analyseTargetIps": 			["isThereProgressBar", "isThereLogs", "getUserCommandsResult", {"jumpif": ["!*.$","@getSoftwares"]}, "getIpsFromLogs", "getBTCAccounts", "getShoppingLogs", "leaveSignature", "updateCrawlerLogs", "isThereMessageError", {"jumpif":["*.$", "@getSoftwares"]}]},
	{"@getSoftwares": 				[{"jumpif":["!*.getSoftwareMode", "@cleanMyOwnLogs"]}, {"wait": 600}, "goToTargetSoftwares", "getSoftwares", "updateCrawlerLogs"]},
	
	{"@fileCreating": 				[{"jumpif": ["!*.$", "@uploadSoftware"]}, "createFiles"]},
	{"@cleanMyUploadClues": 		[{"jumpif": ["*.cleaningLogsDisabled", "@uploadSoftware"]}, "goToTargetLogs", "isThereLogs", {"jumpif": ["!*.$", "@uploadSoftware"]}, "cleanMyIpClues", "submitLogs", "isThereMessageError", {"jumpif":["*.$", "@uploadSoftware"]}, "waitProgressBar"]},

	{"@uploadSoftware": 			[{"jumpif": ["!*.uploadMode", "@cleanMyOwnLogs"]}, "cancelLogProcesses", {"wait": 300}, "runUploadSoftware", "isSoftwareAlreadyThere", {"jumpif":["*.$", "@installSoftware"]}, "isThereMessageError", {"jumpif":["*.$", "@manageCounter"]}, "isThereMessageSuccess", {"jumpif": ["*.$", "@cleanMyUploadClues"]}, "isWithinTimeLimit", {"jumpif": ["!*.$", "@abortUpload"]}, "waitProgressBar"]},
	{"@cleanMyUploadClues": 		["registerUploaded", {"jumpif": ["*.cleaningLogsDisabled", "@installSoftware"]}, "isSkipHideAfterUploadEnabled", {"jumpif":["*.$", "@installSoftware"]},{"wait": 400}, "goToTargetLogs", "isThereLogs", {"jumpif": ["!*.$", "@installSoftware"]}, "cleanMyIpClues", "submitLogs", "isThereMessageError", {"jumpif":["*.$", "@installSoftware"]}, "waitProgressBar"]},
	{"@installSoftware": 			["isInstallRequired", {"jumpif":["!*.$", "@manageCounter"]}, "cancelLogProcesses", {"wait": 300}, "installSoftware", "isThereMessageError", {"jumpif":["((*.$) && (*.skipHideLogs))", "@cleanMyUploadCluesSkipped"]}, {"jumpif":["*.isThereMError", "@manageCounter"]}, "waitProgressBar", {"jumpif":[1, "@cleanMyInstallingClues"]}]},
	{"@cleanMyUploadCluesSkipped": 	[{"jumpif": ["*.cleaningLogsDisabled", "@hideSoftware"]},{"wait": 400}, "goToTargetLogs", "isThereLogs", {"jumpif": ["!*.$", "@manageCounter"]},{"wait": 400}, "cleanMyIpClues", "submitLogs", "isThereMessageError", {"jumpif":["*.$", "@manageCounter"]}, "waitProgressBar", {"jumpif":[1, "@manageCounter"]}]},
	{"@cleanMyInstallingClues": 	[{"jumpif": ["*.cleaningLogsDisabled", "@hideSoftware"]},{"wait": 400}, "goToTargetLogs", "registerInstalled", "isThereLogs", {"jumpif": ["!*.$", "@hideSoftware"]}, {"wait": 400},"cleanMyIpClues", "submitLogs", "isThereMessageError", {"jumpif":["*.$", "@hideSoftware"]}, "waitProgressBar"]},
	{"@hideSoftware": 				["isHiddingRequired", {"jumpif":["!*.$", "@manageCounter"]}, "cancelLogProcesses", {"wait": 300}, "hideSoftware", "isThereMessageError", {"jumpif":["*.$", "@manageCounter"]}, "waitProgressBar"]},
	{"@manageCounter": 				["updateCrawlerLogs", "manageUploadCounter", {"jumpif": ["*.currentSoftware > 0", "@uploadSoftware"]}]},
	{"@cleanMyHiddingClues":  		[{"wait": 400}, "goToTargetLogs", "registerHidden", "isThereLogs", "cleanMyIpClues", "submitLogs", "isThereMessageError", "waitProgressBar"]},

	{"@cleanMyOwnLogs": 			[{"jumpif": ["((*.accessCounter < 3) && (*.openList.length > 0))", "@goToNextTarget"]}, "resetAccessCounter", {"wait": 300}, "goToOwnLogTab", "cancelLogProcesses", "cleanTextAreaContent", "isThereMessageError", {"jumpif":["*.$", "@goToNextTarget"]}, "waitProgressBar", {"jumpif": ["true", "@goToNextTarget"]}]},
	{"@accountInaccessibleHost": 	["registerInaccessible", "updateCrawlerLogs", {"jumpif": ["true", "@goToNextTarget"]}]},
	{"@ignoreIp": 					[{"jumpif": ["true", "@goToNextTarget"]}]},
	{"@abortUpload": 				["abortUpload",{"jumpif": ["true", "@manageCounter"]}]},
	{"@finishProcess": 				{"exit": 1}}
]
