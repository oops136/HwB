var foo = $jSpaghetti.module("camping").sequence("bankCamping")

foo.instructions = [
	{"@init": 						[{"wait": 760},"startBankCamping", {"jumpif":["!*.$", "@finishProcess"]}, "logout"]},
	{"@goToAccountHackIfAvaiable": 	{"jumpif": ["*.accounts.length > 0",{"wait": 760}, "@startAccountAtack"]}},
	{"@checkIpTarget": 				[{"wait": 760},"goToIp", "isThereMessageError", {"jumpif":["*.$", "@finishProcess"]}]},
	{"@tryToInvadeTarget": 			[{"jumpif": ["*.isLogged", "@checkForCaughtAccounts"]}, "forceToAccessTarget", "isThereMessageError", {"jumpif":["*.$", "@accessKnownTarget"]}, "hackTargetBruteForce", "isThereMessageError", {"jumpif":["*.$", "@finishProcess"]}, "waitProgressBar"]},
	{"@accessKnownTarget": 			[{"wait": 760},"goToLoginPage", "cancelLogProcesses", "signInTarget", "isThereMessageError", {"jumpif":["*.$", "@finishProcess"]}]},
	{"@cleanMyCluesAndAnalizeLogs": [{"wait": 760},"goToTargetLogs", "cleanMyIpClues", "extractDataFromLog", "submitLogs", "isThereMessageError", {"jumpif":["*.$", "@checkForCaughtAccounts"]}, "waitProgressBar"]},
	{"@checkForCaughtAccounts": 	{"jumpif": ["*.accounts.length > 0", "@startAccountAtack"]}},
	{"@listen": 					[{"wait": 760},"goToTargetLogs", "cleanMyIpClues", "extractDataFromLog", {"jumpif":["((*.accounts.length > 0) || (*.myCluesFound))", "@submitLogChanges"]}, {"wait":1200}, {"jumpif":["true", "@listen"]}]},
	{"@submitLogChanges": 			["submitLogs", "isThereMessageError", {"jumpif":["*.$", "@checkForCaughtAccounts"]}, "waitProgressBar"]},
	{"@startAccountAtack": 			[{"jumpif": ["*.accounts.length == 0", "@cleanMyOwnLogs"]}, "logout", {"wait": 760},"goToIp", {"wait": 760},"hackAccount", "isThereMessageError", {"jumpif":["*.$", "@accessKnownAccount"]}, "waitProgressBar",{"wait": 760}, "accessUnknownAccount", {"jumpif": ["true", "@transferMoney"]}]},
	{"@accessKnownAccount": 		"accessKnownAccount"},
	{"@transferMoney": 				["isThereMessageError", {"jumpif":["*.$", "@startAccountAtack"]}, "checkFunds", {"jumpif": ["!*.$", "@cleanTransferLogs"]}, {"wait": 1200},"transferMoneyToTarget", "sendMoneyToBTCWallet"]},
	{"@cleanTransferLogs": 			["logoutAccount",{"wait": 760}, "goToIp", "isThereMessageError", {"jumpif":["*.$", "@cleanMyOwnLogs"]},{"wait": 760}, "forceToAccessTarget", "cancelLogProcesses",{"wait": 760}, "signInTarget", "cleanMyIpClues", "extractDataFromLog", "submitLogs", "isThereMessageError", {"jumpif":["*.$", "@cleanMyOwnLogs"]}, "waitProgressBar"]},
	{"@cleanMyOwnLogs": 			[{"jumpif": ["*.accounts.length > 0", "@startAccountAtack"]},{"wait": 760}, "goToOwnLogTab", "cancelLogProcesses", "cleanTextAreaContent", "isThereMessageError", {"jumpif":["*.$", "@tryToInvadeTarget"]}, "waitProgressBar", {"jumpif": ["true", "@tryToInvadeTarget"]}]},
	{"@finishProcess": 				{"exit": 1}}
]