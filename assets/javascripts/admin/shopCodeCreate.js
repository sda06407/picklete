$(function() {

  $("input[name='price-description']").change(function(){
    $("input[name='discount-description']").val("");
    $("input[name='discount-restriction']").val("");
    $("#optionsRadios1")[0].checked=true;
  });

  $("input[name='price-restriction']").change(function(){
    $("input[name='discount-description']").val("");
    $("input[name='discount-restriction']").val("");
    $("#optionsRadios1")[0].checked=true;
  });

  $("input[name='discount-description']").change(function(){
    $("input[name='price-description']").val("");
    $("input[name='price-restriction']").val("");
    $("#optionsRadios2")[0].checked=true;
  });

  $("input[name='discount-restriction']").change(function(){
    $("input[name='price-description']").val("");
    $("input[name='price-restriction']").val("");
    $("#optionsRadios2")[0].checked=true;
  });

  $("#create").click(function () {

    if($("input[name='startDate']").val()=="" || $("input[name='endDate']").val()==""){
      if(!$("input[name='restrictionDate']")[0].checked){
        alert("請輸入活動時間");
        return false;
      }
    }

    var check1 = true,check2 = true;

    if($("input[name='price-description']").val()=="" || $("input[name='price-restriction']").val()==""){
      check1 = false
    }

    if($("input[name='discount-description']").val()=="" || $("input[name='discount-restriction']").val()==""){
      if(!check1)
        check2 =  false;
    }

    if(check1==false && check2==false){
      alert("請輸入折扣");
      return false;
    }

    $("#shopCodeCreateForm").submit();
  });

});
