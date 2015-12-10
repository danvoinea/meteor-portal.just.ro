Instante = new Meteor.Collection('instante');

Dosare = new Meteor.Collection('dosare');

DateDosare = new Meteor.Collection('datedosare');

DateDosare._ensureIndex({
  "parsed": 1,
  "data_start": 1
});

url = 'http://portalquery.just.ro/Query.asmx?wsdl';
