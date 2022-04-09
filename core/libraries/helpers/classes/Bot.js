function Bot(){
	this.currentSequence = null
	this.lastExecutedSequence = null
	this.showMissionAlert = false
	this.codename = "raw"
	this.acme = {}
	this.controlPanel = {
		isHidden: false,
		fieldsContent: {},
		lists: {},
		checkBoxes: {}
	}
	this.webcrawler = {
		current_target_label: null,
		debugLines: []
	}
	this.detected_lang = LANG_EN
	//this.security_keys = ["+ðþ#KT`þ!¹ú,ýÂõU^UYú .0õþð*òðZÊ*õRýö(É¶,#($", "$÷ì$KX.ûöøöÛ.ù$eUS_ú+Ì% ï¹$òýW&#÷a/ö. òUð ½Z!\"PõùÊÉÇ Sd"]
	var fieldsContent = {}
	fieldsContent[FIELD_BANK_IP_TARGET] = ""
	fieldsContent[FIELD_IPS_START_SEARCHING] = ""
	fieldsContent[FIELD_IP_SEARCH_RESULT] = ""
	fieldsContent[REGEX_INPUT_DOM_ID] = ""
	fieldsContent[LANGUAGE_FIELD] = "en"
	//fieldsContent[FIELD_SOFTWARES_TO_INSTALL] = ""
	//fieldsContent[SET_TIME_LIMIT] = ""
	fieldsContent[WEBCRAWLER_SCRIPT] = ''
	//fieldsContent[WEBCRAWLER_SCRIPT_DEBUG] = ""
	fieldsContent[FIELD_HOSTS_TO_IGNORE] = ""
	fieldsContent[FIELD_SIGNATURE] = "👁👁\n"

	fieldsContent[FIELD_DDOS_IP] = ''
	fieldsContent[FIELD_DDOS_TIMES] = 1

	var lists = {}
	lists[FIELD_SUSPECT_LOGS] = []

	var checkBoxes = {}
	checkBoxes[SET_MONITOR_EMAIL] = false
	checkBoxes[SET_MISSIONS_MONITOR] = false
	checkBoxes[SET_LOGS_MONITOR] = true
	//checkBoxes[SET_UPLOAD_MODE] = false
	checkBoxes[SET_SIGNATURE] = false
	checkBoxes[SET_IGNORE_LIST] = false
	checkBoxes[SET_TRANSFER_TO_BTC] = false
	//checkBoxes[SET_SKIP_AFTER_UPLOAD] = false
	//checkBoxes[SET_HIDE_MODE] = false
	checkBoxes[SET_POPUP_AFTER_INSTRUCTION] = true

	this.controlPanel.fieldsContent = fieldsContent
	this.controlPanel.lists = lists
	this.controlPanel.checkBoxes = checkBoxes
}