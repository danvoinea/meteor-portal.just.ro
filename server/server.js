dateRaspuns = DateDosare.find({
  parsed: false
}, {
  limit: 30000,
  sort: {
    data_stop: 1
  }
}).fetch();

var client = Soap.createClient(url);

_.each(dateRaspuns, function(args) {

  var args2 = {
    institutie: args.institutie,
    data_start: args.data_start,
    data_stop: args.data_stop
  };

  console.log(args.institutie + ' ' + args.data_start + ' ' + args.data_stop);

  try {
    var result = client.CautareDosare(args2);
    if (result) {
      console.log('OK');
      _.each(result.CautareDosareResult.Dosar, function(data) {
        Dosare.insert(data);
      });

      DateDosare.update(args, {
        $set: {
          parsed: true,
          failed: false
        }
      });
    }
  } catch (err) {
    if (err.error === 'soap-method') {
      console.log('SOAP Method call failed');
      DateDosare.update(args, {
        $set: {
          parsed: true,
          failed: true
        }
      });
    }
  }

});
