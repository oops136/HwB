var foo = $jSpaghetti.module("missions").sequence("checkBalance")

foo.instructions = [
	{"@askForPermission": 			["askPermissionToAbort", "init"]},
	{"@init": 						[{"wait": 760},"checkBTCWallet", {"jumpif":["!*.$", "@exit"]}, {"wait": 760}, "startCheckBalance", {"jumpif":["!*.$", "@exit"]}]},
	{"@tryToGetMission": 			[{"wait": 760},"goToMissionsTab", "checkSameTypeAcceptedMission", {"jumpif":["*.$", "@startMissionExecution"]}, "isAvailableMissionsPage", {"jumpif":["!*.$", "@alertUnknownMissionKind"]}, "getURLMission", {"jumpif":["*.urlMission == null", "@init"]}]},
	{"@tryToAcceptMission": 		[{"wait": 760},"goToAcceptMissionPage", "isThereMessageError", {"jumpif": ["*.$", "@init"]}, "clickOnAcceptMissionButton", "waitForSubmitButton", "clickOnConfirmAcceptMissionButton", "isThereMessageError", {"jumpif":["*.$", "@init"]}]},
	{"@startMissionExecution": 		["getMissionInfo", {"wait": 760},"logout", {"wait": 760}, "goToNextIp"]},
	{"@hackAccountProcess": 		[{"wait": 760},"hackAccount", "isCrackerStrongEnough", {"jumpif":["!*.$", "@abortProcess"]}, "isThereMessageError", {"jumpif":["*.$", "@signInAccountAndGetBalance"]}, "waitProgressBar"]},
	{"@signInAccountAndGetBalance": [{"wait": 760},"goToPageAccountLoginPage",{"wait": 760}, "signInAccount", "checkFunds", {"jumpif":["!*.$", "@logoutAccount"]}, "getAccountBalance", {"wait": 1000}, "transferToMe", "sendMoneyToBTCWallet"]},
	{"@logoutAccount": 				["getOutFromAccount",{"wait": 760},"logout"]},
	{"@tryHostConnection": 			[{"wait": 200},"forceToAccessTarget", "isThereMessageError", {"jumpif":["*.$", "@accessTarget"]},{"wait": 760}, "hackTargetBruteForce", "isThereMessageError", {"jumpif":["*.$", "@cleanOwnLogs"]}, "waitProgressBar"]},
	{"@accessTarget": 				[{"wait": 760},"goToLoginPage", "cancelLogProcesses", {"wait": 760}, "signInKnownTarget", "isCrackerStrongEnough", {"jumpif":["!*.$", "@abortProcess"]}]},
	{"@cleanTargetLogs": 			[{"wait": 760},"goToTargetLogs", "cleanMyIpClues", {"jumpif": ["*.isEmpty == true", "@cleanOwnLogs"]}, "waitProgressBar"]},
	{"@cleanOwnLogs": 				["logout",{"wait": 760}, "goToOwnLogTab", "cancelLogProcesses", "cleanTextAreaContent", {"jumpif": ["*.isEmpty == true", "@finishMission"]}, "waitProgressBar"]},
	{"@finishMission": 				[{"jumpif":["*.funds == 0", "@abortProcess"]},{"wait": 760}, "goToMissionsTab", "informBalance", "waitForSubmitButton", "confirmMissionCompleteButton", {"wait": 760}, "sendMoneyToBTCWallet", {"jumpif": ["true", "@init"]}]},
	{"@abortProcess": 				[{"jumpif":["*.abortMissionAllowed", "@abortMission"]}, "informBadCracker", {"exit": 1}]},
	{"@abortMission": 				[{"wait": 760},"goToMissionsTab", "clickOnAbortMissionButton", "waitForSubmitButton", "clickOnConfirmAbortMissionButton", {"jumpif": ["true", "@init"]}]},
	{"@alertUnknownMissionKind": 	["alertAnotherMissionKindAlreadyAccepted", {"exit": 1}]},
	{"@exit": 						[{"exit": 1}]}
]

