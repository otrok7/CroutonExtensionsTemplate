crouton_Handlebars.registerHelper("startup", function() {
	var myWords = {
        "de-DE": {
            'hello': 'Guten Tag',
        },
        "en-US": {
	     'hello':  'Howdy',
        },
    };
    for (const isoLang in self.words) {
        if (myWords[isoLang]) {
            Object.assign(self.words[isoLang],myWords[isoLang]);
        }
    }
});
crouton_Handlebars.registerPartial(
    "SayHello",
    "{{getWord 'hello'}} {{this.meeting_name}}"
);
crouton_Handlebars.registerHelper('enrich', function (value) {
    if (value.isEnriched) return "";
    value.isEnriched = true;
    value.meeting_name = "Mr. " + value.meeting_name;
    return '';
});
