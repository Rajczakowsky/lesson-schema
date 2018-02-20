
var sectionElements = [
    '<asset/>',
    '<text/>',
    '<list/>',
    '<paragraph/>',
    '<differentiation/>',
    '<table/>',
    '<question/>',
    '<answer/>',
    '<well/>',
    '<note/>',
    '<glossary/>'
];

var listItemElements = [
    '<text/>',
    '<asset/>',
    '<question/>',
    '<answer/>',
    '<paragraph/>'
];

var differentiationElements = [
    '<paragraph/>',
    '<text/>',
    '<list/>'
];

var generalContentElements= [
    '<text/>',
    '<list/>',
    '<asset/>',
    '<paragraph/>',
    '<question/>',
    '<answer/>'
];

var glossaryElements = [
    '<glossaryWord/>',
    '<glossaryDefinition/>',
    '<glossaryExample/>',
    '<glossaryQuestion/>',
    '<glossaryRelatedWords/>'
];

var differentiationTypes = [
    'English Learners',
    'Standard English Learners',
    'Challenge',
    'Special Needs',
    'Cultural Connection'
];


var lessonStageSchema = {
    'lessonStage': {
        menu: addMenuItems(null, ['<section/>'], null, false),
    },
    'section': {
        menu: addMenuItems(['heading', 'type'], sectionElements, '<section/>', false),
        attributes: {
            'heading': {
                asker: Xonomy.askString,
                validate: function(jsAttribute){
                    isRequired(jsAttribute)
                },
            },
            'type': {
                asker: Xonomy.askPicklist,
                askerParameter: ['objectives'],
                menu: [
                    deleteAttribute('type')
                ]
            }
        },
        canDropTo: ['lessonStage']
    },
    'answer': {
        menu: addMenuItems(null, null, '<answer/>', false),
        hasText: true,
        asker: Xonomy.askString,
        canDropTo: ['listItem'],
    },
    'asset': {
        menu: _.flattenDeep([
            addMenuAttribute('teacherOnly', 'false'),
            addMenuItems(['contentID', 'type'], null, '<asset/>', false),
        ]),
        hasText: true,
        oneliner: true,
        asker: Xonomy.askString,
        attributes: {
            'contentID': {
                asker: Xonomy.askString,
                validate: function(jsAttribute){
                    isCorrectAssetID(jsAttribute)
                },
            },
            'type': {
                asker: Xonomy.askPicklist,
                askerParameter: ['preview', 'text', 'link'],
                validate: function(jsAttribute){
                    isRequired(jsAttribute)
                },
            },
            'teacherOnly': {
                asker: Xonomy.askPicklist,
                askerParameter: ['false', 'true'],
                validate: function(jsAttribute){
                    isRequired(jsAttribute)
                }
            }
        },
        canDropTo: ['section', 'listItem', 'differentiation', 'paragraph'],
    },
    'cell': {
        menu: addMenuItems(null, ['<text/>', '<list/>', '<asset/>', '<paragraph/>'], '<cell/>', false),
        canDropTo: ['row'],
    },
    'differentiation': {
        menu: addMenuItems(['type'], differentiationElements, '<differentiation/>', false),
        attributes: {
            'type': {
                asker: Xonomy.askPicklist,
                askerParameter: differentiationTypes,
                validate: function(jsAttribute){
                    isRequired(jsAttribute)
                },
            }
        },
        canDropTo: ['section']
    },
    'glossary': {
         menu: addMenuItems( null, glossaryElements, '<glossary/>', true ),
         canDropTo: ['section']
    },
    'glossaryWord': addOneLinerStringElement('<glossaryWord/>'),
    'glossaryDefinition': addOneLinerStringElement('<glossaryDefinition/>'),
    'glossaryExample': addOneLinerStringElement('<glossaryExample/>'),
    'glossaryQuestion': addOneLinerStringElement('<glossaryQuestion/>'),
    'glossaryRelatedWords': addOneLinerStringElement('<glossaryRelatedWords/>'),
    'list': {
        menu: addMenuItems(['type'], ['<listItem/>'], '<list/>', false),
        attributes: {
            'type': {
                asker: Xonomy.askPicklist,
                askerParameter: [ 'unstyled', 'numbered', 'bullet points'],
                validate: function(jsAttribute){
                    isRequired(jsAttribute)
                },
            },
        },
        canDropTo: ['section'],
    },
    'listItem': {
        menu: addMenuItems(null, listItemElements, '<listItem/>', false),
        canDropTo: ['list'],
    },
    'note': {
        menu : addMenuItems(null, listItemElements, '<note/>', false),
        canDropTo: ['section']
    },
    'objectives': {
        menu: addMenuItems(null, generalContentElements, '<objectives/>', false),
        canDropTo: ['lessonStage'],
    },
    'paragraph': {
        menu: addMenuItems(null, ['<text/>', '<asset/>'], '<paragraph/>', false),
        canDropTo: ['section', 'listItem', 'differentiation'],
    },
    'question': {
        menu: addMenuItems(null, null, '<question/>', false),
        hasText: true,
        asker: Xonomy.askString,
        canDropTo: ['listItem'],
    },
    'row': {
        menu: addMenuItems(null, ['<cell/>'], '<row/>', false),
        canDropTo: ['table'],
    },
    'table': {
        menu: addMenuItems(['highlight'], ['<row/>'], '<table/>', false),
        canDropTo: ['section'],
        attributes: {
            'highlight': {
                asker: Xonomy.askPicklist,
                askerParameter: [ 'no highlight', 'top row', 'left column', 'top row and left column'],
                validate: function(jsAttribute){
                    isRequired(jsAttribute)
                },
            },
        },
    },
    'text': {
        menu: [
            deleteElement('<text/>')
        ],
        hasText: true,
        asker: Xonomy.askLongString,
        canDropTo: ['section', 'listItem', 'asset', 'differentiation', 'paragraph'],
    },
    'well': {
        menu : addMenuItems([ 'type'], generalContentElements, '<well/>', false),
        attributes: {
            'type': {
                asker: Xonomy.askPicklist,
                askerParameter: ['Pre-Work', 'Safety', 'Fact Board'],
                validate: function(jsAttribute){
                    isRequired(jsAttribute)
                },
            },
        }
    }
};


var docSpec = {
    onchange: function(){
        console.log('I been changed now!')
    },
    validate: function(jsElement){
        //Validate the element:
        var elementSpec=docSpec.elements[jsElement.name];
        if(elementSpec.validate) elementSpec.validate(jsElement);
        //Cycle through the element's attributes:
        for(var i=0; i<jsElement.attributes.length; i++) {
            var jsAttribute=jsElement.attributes[i];
            var attributeSpec=elementSpec.attributes[jsAttribute.name];
            if(attributeSpec.validate) attributeSpec.validate(jsAttribute);
        };

        //Cycle through the element's children:
        for(var i=0; i<jsElement.children.length; i++) {
            var jsChild=jsElement.children[i];
                if(jsChild.type=='element') {
                    docSpec.validate(jsChild); //recursion
                }
            }
        },
    elements: lessonStageSchema
};
