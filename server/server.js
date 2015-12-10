Instante = new Meteor.Collection('instante');
Dosare = new Meteor.Collection('dosare');
DateDosare = new Meteor.Collection('datedosare');
var Future = Npm.require("fibers/future");



DateDosare._ensureIndex({
  "parsed": 1,
  "data_start": 1
});


var url = 'http://portalquery.just.ro/Query.asmx?wsdl';

if (Instante.find({}).count() === 0) {
  console.log("Importing instante to add");
  var parse = Meteor.npmRequire('csv-parse');
  var instante = Assets.getText('instante-2013.csv');

  parse(instante, Meteor.bindEnvironment(function(err, data) {
    _.each(data, function(value, index) {
      Instante.insert({
        "denumire": value[0],
        "codInformatic": value[1]
      });
    });
  }));
}

if (DateDosare.find({}).count() === 0) {
  console.log("Importing dates to add");
  var data_start = moment("19891218", "YYYYMMDD");
  var data_stop = moment(data_start).add(13, 'day');
  var data_stop_final = moment("20151220", "YYYYMMDD");

  var listaInstante = Instante.find({}).fetch();

  while (data_stop < data_stop_final) {
    data_start = moment(data_start).add(14, 'day');
    data_stop = moment(data_stop).add(14, 'day');
    _.each(listaInstante, function(instanta) {
      obj = {
        institutie: instanta.codInformatic,
        data_start: data_start.format('YYYY-MM-DD'),
        data_stop: data_stop.format('YYYY-MM-DD'),
        parsed: false
      }
      DateDosare.insert(obj);
    });
  }
}


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

console.log('done');
