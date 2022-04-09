var foo = $jSpaghetti.module("missions").sequence("deleteSoftware")

foo.instructions = [
	{"@askForPermission": 			["askPermissionToAbort", "init"]},
	{"@init": 						[{"wait": 760},"checkBTCWallet", {"jumpif":["!*.$", "@exit"]}, {"wait": 760}, "startDeleteSoftware", {"jumpif":["!*.$", "@exit"]}]},
	{"@tryToGetMission": 			[{"wait": 760},"goToMissionsTab", "checkSameTypeAcceptedMission", {"jumpif":["*.$", "@startMissionExecution"]}, "isAvailableMissionsPage", {"jumpif":["!*.$", "@alertUnknownMissionKind"]}, "getURLMission", {"jumpif":["*.urlMission == null", "@init"]}]},
	{"@tryToAcceptMission": 		[{"wait": 760},"goToAcceptMissionPage", "isThereMessageError", {"jumpif": ["*.$", "@init"]}, "clickOnAcceptMissionButton", "waitForSubmitButton", "clickOnConfirmAcceptMissionButton", "isThereMessageError", {"jumpif":["*.$", "@init"]}]},
	{"@startMissionExecution": 		["getDeleteSoftwareMissionInfo", "logout", {"wait": 760}, "goToNextIp"]},
	{"@tryHostConnection": 			[{"wait": 200},"forceToAccessTarget", "isThereMessageError", {"jumpif":["*.$", "@accessTarget"]}, {"wait": 760}, "hackTargetBruteForce", "isCrackerStrongEnough", {"jumpif":["!*.$", "@abortProcess"]}, "isThereMessageError", {"jumpif":["*.$", "@cleanOwnLogs"]}, "waitProgressBar"]},
	{"@accessTarget": 				[{"wait": 760},"goToLoginPage", "cancelLogProcesses", {"wait": 760}, "signInKnownTarget", "isCrackerStrongEnough", {"jumpif":["!*.$", "@abortProcess"]}]},
	{"@cleanTargetLogs": 			[{"wait": 760},"goToTargetLogs", "cleanMyIpClues", {"jumpif": ["*.isEmpty == true", "@cleanOwnLogs"]}, "waitProgressBar"]},
	{"@tryToDeleteSoftware": 		["getSoftwareId", {"jumpif": ["!*.$", "@abortProcess"]}, {"wait": 760}, "deleteSoftware", "isThereMessageError", {"jumpif":["*.$", "@abortProcess"]}, "waitProgressBar"]},
	{"@cleanDeletingLogs": 			[{"wait": 760},"goToTargetLogs", "cleanMyIpClues", {"jumpif": ["*.isEmpty == true", "@cleanOwnLogs"]}, "waitProgressBar"]},
	{"@cleanOwnLogs": 				["logout", {"wait": 760}, "goToOwnLogTab", "cancelLogProcesses", "cleanTextAreaContent", {"jumpif": ["*.isEmpty == true", "@finishMission"]}, "waitProgressBar"]},
	{"@finishMission": 				[{"wait": 760},"goToMissionsTab", "clickOnFinishButton", "waitForSubmitButton", "confirmMissionCompleteButton", {"wait": 760}, "sendMoneyToBTCWallet", {"jumpif": ["true", "@init"]}]},
	{"@abortProcess": 				[{"jumpif":["*.abortMissionAllowed", "@abortMission"]}, "showMessage", {"exit": 1}]},
	{"@abortMission": 				[{"wait": 760},"goToMissionsTab", "clickOnAbortMissionButton", "waitForSubmitButton", "clickOnConfirmAbortMissionButton", {"jumpif": ["true", "@init"]}]},
	{"@alertUnknownMissionKind": 	["alertAnotherMissionKindAlreadyAccepted", {"exit": 1}]},
	{"@exit": 						[{"exit": 1}]}
]

