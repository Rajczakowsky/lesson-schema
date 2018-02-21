
var differentiationTypes = [
    'English Learners',
    'Standard English Learners',
    'Challenge',
    'Special Needs',
    'Cultural Connection'
];

var defaultParagraphElement = addMenuElement('paragraph');
var defaultTextElement = addMenuElement('text');
var defaultAssetElement = addMenuElement('asset', null, null, null, 'contentID="" type="" teacherOnly="false"');
var defaultListElement = addMenuElement('list', null, null, null, 'type="bullet points"');
var defaultAnswerElement = addMenuElement('answer');
var defaultQuestionElement = addMenuElement('question');
var defaultDifferentiationElement = addMenuElement('differentiation', null, null, null, 'type=""');
var defaultTableElement = addMenuElement('table', null, null, null, 'highlight="no highlight"');

var lessonStageSchema = {
    'lessonStage': {
        menu: [
            addMenuElement('section', null, null, null, 'heading="" type="default"'),
        ]
    },
    'section': {
        menu: [
            addMenuAttribute('heading'),
            addMenuAttribute('type', 'default'),
            defaultAssetElement,
            defaultAnswerElement,
            defaultDifferentiationElement,
            defaultListElement,
            defaultParagraphElement,
            defaultQuestionElement,
            defaultTableElement,
            defaultTextElement,
            addMenuElement('glossary'),
            addMenuElement('note'),
            addMenuElement('well', null, null, null, 'type=""'),
            deleteElement('section')
        ],
        attributes: {
            'heading': {
                asker: Xonomy.askString,
                validate: function(jsAttribute){
                    isRequired(jsAttribute)
                },
            },
            'type': {
                asker: Xonomy.askPicklist,
                askerParameter: ['default', 'objectives']
            }
        },
        canDropTo: ['lessonStage']
    },
    'answer': addStringElement('answer', ['section', 'listItem']),
    'asset': {
        menu: [
            addMenuAttribute('contentID'),
            addMenuAttribute('type'),
            addMenuAttribute('teacherOnly', 'false'),
            deleteElement('asset')
        ],
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
                askerParameter: ['preview', 'text'],
                validate: function(jsAttribute){
                    isRequired(jsAttribute)
                },
            },
            'teacherOnly': {
                asker: Xonomy.askPicklist,
                askerParameter: ['false', 'true'],
            }
        },
        canDropTo: ['section', 'listItem', 'differentiation', 'paragraph'],
    },
    'cell': {
        menu: [
            defaultParagraphElement,
            defaultTextElement,
            defaultAssetElement,
            defaultListElement,
            deleteElement('cell')
        ],
        canDropTo: ['row'],
    },
    'differentiation': {
        menu: [
            addMenuAttribute('type'),
            defaultParagraphElement,
            defaultTextElement,
            defaultAssetElement,
            defaultListElement,
            deleteElement('differentiation')
        ],
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
         menu: [
            addMenuElement(
                'glossaryWord',
                null,
                null,
                function(jsElement) {
                    return jsElement.hasChildElement('glossaryWord');
                }
            ),
            addMenuElement(
                'glossaryDefinition',
                null,
                null,
                function(jsElement) {
                    return jsElement.hasChildElement('glossaryDefinition');
                }
            ),
            addMenuElement(
                'glossaryExample',
                null,
                null,
                function(jsElement) {
                    return jsElement.hasChildElement('glossaryExample');
                }
            ),
            addMenuElement(
                'glossaryQuestion',
                null,
                null,
                function(jsElement) {
                    return jsElement.hasChildElement('glossaryQuestion');
                }
            ),
            addMenuElement(
                'glossaryRelatedWords',
                null,
                null,
                function(jsElement) {
                    return jsElement.hasChildElement('glossaryRelatedWords');
                }
            )
        ],
         canDropTo: ['section']
    },
    'glossaryWord': addStringElement('glossaryWord', null, true),
    'glossaryDefinition': addStringElement('glossaryDefinition', null, true),
    'glossaryExample': addStringElement('glossaryExample', null, true),
    'glossaryQuestion': addStringElement('glossaryQuestion', null, true),
    'glossaryRelatedWords': addStringElement('glossaryRelatedWords', null, true),
    'list': {
        menu: [
            addMenuAttribute('type'),
            addMenuElement('listItem'),
            deleteElement('list')
        ],
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
        menu: [
            defaultParagraphElement,
            defaultTextElement,
            defaultAssetElement,
            defaultListElement,
            defaultAnswerElement,
            defaultQuestionElement,
            deleteElement('listItem')
        ],
        canDropTo: ['list'],
    },
    'note': {
        menu: [
            defaultParagraphElement,
            defaultTextElement,
            defaultAssetElement,
            defaultListElement,
            defaultQuestionElement,
            defaultAnswerElement,
            deleteElement('note')
        ],
        canDropTo: ['section']
    },
    'paragraph': {
        menu: [
            defaultTextElement,
            defaultAssetElement,
            deleteElement('paragraph')
        ],
        canDropTo: ['section', 'listItem', 'differentiation'],
    },
    'question': addStringElement('question', ['section', 'listItem']),
    'row': {
        menu: [
            addMenuElement('cell'),
            deleteElement('row')
        ],
        canDropTo: ['table'],
    },
    'table': {
        menu: [
            addMenuAttribute('highlight'),
            addMenuElement('row'),
            deleteElement('table')
        ],
        canDropTo: ['section'],
        attributes: {
            'highlight': {
                asker: Xonomy.askPicklist,
                askerParameter: [ 'no highlight', 'top row', 'left column', 'top row and left column']
            },
        },
    },
    'text': {
        menu: [
            deleteElement('text')
        ],
        hasText: true,
        asker: Xonomy.askLongString,
        canDropTo: ['section', 'listItem', 'asset', 'differentiation', 'paragraph'],
    },
    'well': {
        menu : [
            addMenuAttribute('highlight'),
            defaultParagraphElement,
            defaultTextElement,
            defaultAssetElement,
            defaultListElement,
            defaultQuestionElement,
            defaultAnswerElement,
            deleteElement('well')
        ],
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
