var foo = $jSpaghetti.module("missions").sequence("transferMoney")

foo.instructions = [
	{"@askForPermission": 			["askPermissionToAbort", "init"]},
	{"@init": 						[{"wait": 760},"checkBTCWallet", {"jumpif":["!*.$", "@exit"]}, {"wait": 760}, "startTransferMoney", {"jumpif":["!*.$", "@exit"]}]},
	{"@tryToGetMission": 			[{"wait": 760},"goToMissionsTab", "checkSameTypeAcceptedMission", {"jumpif":["*.$", "@startMissionExecution"]}, "isAvailableMissionsPage", {"jumpif":["!*.$", "@alertUnknownMissionKind"]}, "getURLMission","boo", {"jumpif":["*.urlMission == null", "@init"]}]},
	{"@tryToAcceptMission": 		[{"wait": 760},"goToAcceptMissionPage", "isThereMessageError", {"jumpif": ["*.$", "@init"]}, "clickOnAcceptMissionButton", "waitForSubmitButton", "clickOnConfirmAcceptMissionButton", "isThereMessageError", {"jumpif":["*.$", "@init"]}]},
	{"@startMissionExecution": 		[{"wait": 760},"getMissionInfo", "logout",{"wait": 760}, "goToNextIp"]},
	{"@hackAccountProcess": 		[{"wait": 760},"hackAccount", "isCrackerStrongEnough", {"jumpif":["!*.$", "@abortProcess"]}, "isThereMessageError", {"jumpif":["*.$", "@signInAccountAndTransfer"]}, "waitProgressBar"]},
	{"@signInAccountAndTransfer": 	[{"wait": 760},"goToPageAccountLoginPage",{"wait": 760}, "signInAccount", "checkFunds", {"jumpif":["!*.$", "@logoutAccount"]}, {"wait": 600}, "transferRandomValueToTarget", {"jumpif":["*.rest <= 0", "@logoutAccount"]}, {"wait":600}, "transferTheRestToMe", {"wait": 760}, "sendMoneyToBTCWallet"]},
	{"@logoutAccount": 				[{"wait": 760},"getOutFromAccount", "logout"]},
	{"@tryHostConnection": 			[{"wait": 200},"forceToAccessTarget", "isThereMessageError", {"jumpif":["*.$", "@accessTarget"]},{"wait": 760}, "hackTargetBruteForce", "isThereMessageError", {"jumpif":["*.$", "@cleanOwnLogs"]}, "waitProgressBar"]},
	{"@accessTarget": 				[{"wait": 760},"goToLoginPage", "cancelLogProcesses", {"wait": 760}, "signInKnownTarget"]},
	{"@cleanTargetLogs": 			[{"wait": 760},"goToTargetLogs", "cleanMyIpClues", {"jumpif": ["*.isEmpty == true", "@cleanOwnLogs"]}, "waitProgressBar"]},
	{"@cleanOtherTargetLogs": 		[{"jumpif": ["((*.cleanerCount == 2) || (*.ips[0] == *.ips[1]))", "@cleanOwnLogs"]}, "logout",{"wait": 760}, "goToNextIp", {"jumpif": ["true", "@tryHostConnection"]}]},
	{"@cleanOwnLogs": 				["logout",{"wait": 760}, "goToOwnLogTab", "cancelLogProcesses", "cleanTextAreaContent", {"jumpif": ["*.isEmpty == true", "@finishMission"]}, "waitProgressBar"]},
	{"@finishMission": 				[{"jumpif":["*.funds == 0", "@abortProcess"]}, {"wait": 760},"goToMissionsTab", "clickOnFinishButton", "waitForSubmitButton", "confirmMissionCompleteButton", {"wait": 760},"sendMoneyToBTCWallet", {"jumpif": ["true", "@init"]}]},
	{"@abortProcess": 				[{"jumpif":["*.abortMissionAllowed", "@abortMission"]}, "informBadCracker", {"exit": 1}]},
	{"@abortMission": 				[{"wait": 760},"goToMissionsTab", "clickOnAbortMissionButton", "waitForSubmitButton", "clickOnConfirmAbortMissionButton", {"jumpif": ["true", "@init"]}]},
	{"@alertUnknownMissionKind": 	["alertAnotherMissionKindAlreadyAccepted", {"exit": 1}]},
	{"@exit": 						[{"exit": 1}]}
]