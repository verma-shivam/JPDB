
var connToken = "90937858|-31949272067065342|90952070";
var dbName = "COLLEGE-DB";
var relName = "PROJECT-TABLE";
var jpdbBaseURL = "http://api.login2explore.com:5577";
var jpdbIML = "/api/iml";
var jpdbIRL = "/api/irl";



$('#projectId').focus();
$('#save').prop('disabled', true);
$('#update').prop('disabled', true);
$('#reset').prop('disabled', true);

function saveRecNoToLS(jsonObj) {
    var lvData = JSON.parse(jsonObj.data);
    localStorage.setItem('recno',lvData.rec_no);
}

function getProjectIdAsJsonObj() {
    var id = $('#projectId').val();
    var jsonStr = {
        projectId: id
    };
    return JSON.stringify(jsonStr);
}

function fillData(jsonObj) {
    saveRecNoToLS(jsonObj);
    var record = JSON.parse(jsonObj.data).record;
    $('#projectName').val(record.projectName);
    $('#assignedTo').val(record.assignedTo);
    $('#assignedDate').val(record.assignedDate);
    $('#deadline').val(record.deadline);
}

function resetForm() {
    $('#projectId').val("");
    $('#projectName').val("");
    $('#assignedTo').val("");
    $('#assignedDate').val("");
    $('#deadline').val("");
    $('#projectId').prop('disabled', false);
    $('#save').prop('disabled',true);
    $('#update').prop('disabled',true);
    $('#reset').prop('disabled',true);
    $('#projectId').focus();
  
}

function validateAndGetFormData() {
    var projectIdVar = $('#projectId').val();
    var projectNameVar = $('#projectName').val();
    var assignedToVar = $('#assignedTo').val();
    var assignedDateVar = $('#assignedDate').val();
    var deadlineVar = $('#deadline').val();
  
    if (projectIdVar === "") {
      alert("Project ID Is Required!");
      $('#projectId').focus();
      return "";
    }
  
    if (projectNameVar === "") {
      alert("Project Name Is Reqiured!");
      $('#projectName').focus();
      return "";
    }
  
    if (assignedToVar === "") {
      alert("Student Name Is Required!");
      $('#assignedTo').focus();
      return "";
    }
  
    if (assignedDateVar === "") {
      alert("Assigned Date Is Required!");
      $('#assignedDate').focus();
      return "";
    }
  
    if (deadlineVar === "") {
      alert("Deadline Is Required!");
      $('#deadline').focus();
      return "";
    }
  
    var jsonStrObj = {
      projectId: projectIdVar,
      projectName: projectNameVar,
      assignedTo: assignedToVar,
      assignedDate: assignedDateVar,
      deadline: deadlineVar,
    };
  
    return JSON.stringify(jsonStrObj);
}

function getProject() {
    var projectIdJsonObj = getProjectIdAsJsonObj();
    var getRequest = createGET_BY_KEYRequest(
        connToken, 
        dbName, 
        relName, 
        projectIdJsonObj
    );
    
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(getRequest, jpdbBaseURL, jpdbIRL);
    jQuery.ajaxSetup({async: true});

    if (resJsonObj.status === 400) {
        $('#save').prop('disabled', false);
        $('#reset').prop('disabled', false);
        $('#projectName').focus();
    } else if(resJsonObj.status === 200) {
        $('#projectId').prop('disabled', true);
        
        fillData(resJsonObj);

        $('#update').prop('disabled', false);
        $('#reset').prop('disabled', false);
        $('#projectName').focus();
    }
}

function saveData() {
    var jsonStrObj = validateAndGetFormData();
    if (jsonStrObj === "") {
        return;
    }
    var putReqStr = createPUTRequest(
        connToken,
        jsonStrObj,
        dbName,
        relName
    );

  jQuery.ajaxSetup({ async: false });
  var resJsonObj = executeCommandAtGivenBaseUrl(
    putReqStr,
    jpdbBaseURL,
    jpdbIML
  );

  jQuery.ajaxSetup({ async: true });
  resetForm();
  $('#projectId').focus();
}

function updateData() {
    $('#update').prop('disabled',true);
    jsonChg = validateAndGetFormData();
    var updateRequest = createUPDATERecordRequest(connToken, jsonChg, dbName, relName, localStorage.getItem('recno'));
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(updateRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({async: true});
    console.log(resJsonObj);
    resetForm();
    $('#projectId').focus();
}
