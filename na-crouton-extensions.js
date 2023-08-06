crouton_Handlebars.registerHelper("startup", function() {
	var myWords = {
		"de": {
            'week*': 'Sonst: ',
            'popupformat': 'Meetingsformat',
            'popupinfo': 'Meetingsinfo',
            'style:align': '',
            'float-dir': '',
            'zoom': 'zum Video-Meeting',
            'or': 'oder',
            'meeting_count_label' : 'Wöchentliche Meetings: ',
            'code' :'Code',
        },
        "en": {
        },
        "fa": {
        }
    };
    for (const isoLang in self.words) {
        var lang = isoLang.substring(0,2);
        if (myWords[lang]) {
            Object.assign(self.words[isoLang],myWords[lang]);
        }
    }
});
crouton_Handlebars.registerHelper('console', function (value) {
    console.log(value);
    return "";
});
crouton_Handlebars.registerHelper('selectFormatPopup', function() {return "formatPopup2";});
crouton_Handlebars.registerPartial(
    "virtualButtons",
    "{{#if meeting.isZoomMeeting}}"
    +"<a target='_blank' href='{{meeting.virtual_meeting_link}}' id='map-button' class='btn btn-primary {{css_class}}'>{{getWord 'zoom'}}</a>"
    +"<br/>{{getWord 'or'}}<br/>"
    +"<a href='tel:{{phone}}' id='map-button' class='btn btn-primary {{css_class}}'>{{phone}}<br/>{{getWord 'code'}}: {{meeting.zoomCode}}"
    +"<br/>{{meeting.virtual_meeting_additional_info}}</a>"
    +"{{/if}}"
);
crouton_Handlebars.registerPartial("formatPopup2",
`<table class='bmlt_a_format table-bordered'>
    {{#each this.formats_table}}
        {{#each this}}
            <tr>
            
                <td class='formats_header' {{getWord 'style:align'}} colspan=2>{{getWord @key}}</td>
            </tr>
            {{#each this}}
                <tr>
                    {{#each this}}
                        <td>{{this}}</td>
                    {{/each}}
                </tr>
            {{/each}}
        {{/each}}
    {{/each}}
</table>`);
crouton_Handlebars.registerHelper('enrich', function (value) {
    if (value.isEnriched) return "";
    value.isEnriched = true;
    value.isZoomMeeting = false;

    var link = value.virtual_meeting_link;
    if (link && link.substring(0, 4) === "tel:") {
        value.isTelephone = true;
        var parts = link.split('/');
        if (parts.length==1) {
           value.phoneLink = link;
        }
        value.phoneLink = parts[0];
        if (count(parts)>1) {
            var code = parts[parts.length-1];
            parts = code.split("?pin=");
            value.phoneCode = parts[0];
            if (parts.length()>1) {
                value.phonePIN = parts[1];
            }
        }
    }
    if (link=="http://na-telefonmeeting.de/") {
        value.isNATelefonMeetingDe = true;
    }
    if (link && link.includes("zoom")>0) {
        value.isZoomMeeting = true;
        parts = link.split('/');
        code = parts[parts.length-1];
        parts = code.split('?pwd=');
        value.zoomCode = parts[0];
    }
    var formats_by_type = [];
    value.formats_expanded.forEach(function(format) {
        var mainType = "";
        var subType = "";
        if (format.type) {
            var parts = format.type.split('-');
            mainType = parts[0];
            if (parts.length > 1) {
                subType = parts[1];
            }
        }
        if (formats_by_type[mainType]) {
            if (subType.length==0) {
                formats_by_type[mainType].push(format);
            } else {
                formats_by_type[mainType][subType] = format;
            }
        }
        else {
            if (subType.length==0) {
                formats_by_type[mainType] = [format];
            } else {
                formats_by_type[mainType] = [];
                formats_by_type[mainType][subType] = format;
            }
        }
    });
    value.formats_table = [];
    value.formats = "";
    var needComma = false;
    var weeks = ["1","2","3","4","5","L",'*'];
    if (formats_by_type['FC2'] || formats_by_type['FC3'] || formats_by_type['O']) {
        var formats_table = {'PopupInfo': []};
        if (formats_by_type['FC2']) {
            Object.assign(formats_table.PopupInfo, formats_by_type['FC2'].map(f => [f.key, f.description]));
            value.formats +=
                (needComma ? ',' : '') +
                formats_by_type['FC2'].map(f => f.key).join(',');
            needComma = true;
        }
        if (formats_by_type['FC3']) {
            Object.assign(formats_table.PopupInfo, formats_by_type['FC3'].map(f => [f.key, f.description]));
            value.formats +=
            (needComma ? ',' : '') +
            formats_by_type['FC3'].map(f => f.key).join(',');
            needComma = true;
        }
        if (formats_by_type['O']) {
            weeks.forEach(function(week){
                if (formats_by_type['O'][week]) {
                    formats_table.PopupInfo.push([formats_by_type['O'][week].key, formats_by_type['O'][week].description]);
                    value.formats +=
                        (needComma ? ',' : '') + formats_by_type['O'][week].key;
                    needComma = true;
                }
            });
        }
        value.formats_table.push(formats_table);
    }
    if (needComma && (formats_by_type['FC1'] || value.format_comments)) value.formats += '/';
    needComma = false;
    if (formats_by_type['FC1'] || value.format_comments) {
        var formats_table = {'PopupFormat': []};

        if (formats_by_type['FC1']) {
            weeks.forEach(function(week){
                if (formats_by_type['FC1'][week]) {
                    formats_table['PopupFormat'].push([formats_by_type['FC1'][week].key, formats_by_type['FC1'][week].description]);
                    value.formats += (needComma ? ',' : '') + formats_by_type['FC1'][week].key;
                    needComma = true;
                }
            });
        }
        if (value.format_comments) {
            value.formats += (needComma ? ',' : '') + '*';
            formats_table['PopupFormat'].push(['*', value.format_comments]);
        }
        value.formats_table.push(formats_table);
    }
    value.langs = [];
    if (formats_by_type['LANG']) {
        value.langs = formats_by_type['LANG'].map( function(f) {
            f.flag = c_g_CroutonExtension_flags + f.key + '.png';
            return f;
        });
    }
    address_parts = [];
    if (value['location_street']) {
        address_parts.push(value['location_street']);
    }
    if (value['location_postal_code_1']) {
        var zipCity = value['location_postal_code_1'];
        if (value['location_municipality']) {
            zipCity += ' '+ value['location_municipality'];
        }
        address_parts.push(zipCity);
    }
    else if (value['location_municipality']) {
        address_parts.push(value['location_municipality']);
    }
    if (value['location_province']) {
        address_parts.push(value['location_province']);
    }
    value.formatted_address = address_parts.join(', ');
    return "";
});
