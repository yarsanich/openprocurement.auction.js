function(doc) {
  var end = new Date(doc.endDate||doc.stages[0].start).getTime();
  var start = doc.stages[0].start || "";
  emit(end, {ID: doc.tenderID, start: start});
}
