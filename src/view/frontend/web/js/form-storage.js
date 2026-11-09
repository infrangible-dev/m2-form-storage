/**
 * @author      Andreas Knollmann
 * @copyright   2014-2026 Softwareentwicklung Andreas Knollmann
 * @license     http://www.opensource.org/licenses/mit-license.php MIT
 */

/* global define */

define([
    'jquery',
    'domReady',
    'jquery/jquery-storageapi',
], function ($, domReady) {
    'use strict';

    const globalOptions = {
        storageName: null,
        textFields: [
            'input[type=color]',
            'input[type=date]',
            'input[type=datetime-local]',
            'input[type=email]',
            'input[type=month]',
            'input[type=number]',
            'input[type=password]',
            'input[type=range]',
            'input[type=search]',
            'input[type=tel]',
            'input[type=time]',
            'input[type=text]',
            'input[type=url]',
            'input[type=week]',
        ],
        textareaFields: [
            'textarea',
        ],
        checkboxFields: [
            'input[type=checkbox]',
        ],
        radioFields: [
            'input[type=radio]',
        ],
        selectFields: [
            'select',
        ],
    };

    $.widget('infrangible.formStorage', {
        options: globalOptions,

        _create: function createStorageFormData() {
            const self = this;

            if (self.options.storageName === null) {
                if (self.element.attr('name')) {
                    self.options.storageName = self.element.attr('name');
                } else if (self.element.attr('id')) {
                    self.options.storageName = self.element.attr('id');
                }
            }

            const observer = new MutationObserver(function (nodes) {
                $.each(nodes, function (index, node) {
                    if (node.addedNodes.length > 0) {
                        $.each(node.addedNodes, function (index, addedNode) {
                            self.restoreField($(addedNode));
                            self.bindField($(addedNode));
                        });
                    }
                });
            });

            observer.observe(self.element[0], {
                childList: true,
                subtree: true,
            });
        },

        _init: function initStorageFormData() {
            const self = this;

            domReady(function() {
                self.restoreForm();

                $.each(self.options.textFields, function(index, selector) {
                    self.element.find(selector).each(function() {
                        self.bindFieldText($(this));
                    });
                });

                $.each(self.options.textareaFields, function(index, selector) {
                    self.element.find(selector).each(function() {
                        self.bindFieldTextarea($(this));
                    });
                });

                $.each(self.options.checkboxFields, function(index, selector) {
                    self.element.find(selector).each(function() {
                        self.bindFieldCheckbox($(this));
                    });
                });

                $.each(self.options.radioFields, function(index, selector) {
                    self.element.find(selector).each(function() {
                        self.bindFieldRadio($(this));
                    });
                });

                $.each(self.options.selectFields, function(index, selector) {
                    self.element.find(selector).each(function() {
                        self.bindFieldSelect($(this));
                    });
                });
            });
        },

        bindField: function(field) {
            const self = this;

            $.each(self.options.textFields, function(index, selector) {
                if (field.is(selector)) {
                    self.bindFieldText(field);
                }
            });

            $.each(self.options.textareaFields, function(index, selector) {
                if (field.is(selector)) {
                    self.bindFieldTextarea(field);
                }
            });

            $.each(self.options.checkboxFields, function(index, selector) {
                if (field.is(selector)) {
                    self.bindFieldCheckbox(field);
                }
            });

            $.each(self.options.radioFields, function(index, selector) {
                if (field.is(selector)) {
                    self.bindFieldRadio(field);
                }
            });

            $.each(self.options.selectFields, function(index, selector) {
                if (field.is(selector)) {
                    self.bindFieldSelect(field);
                }
            });
        },

        bindFieldText: function(field) {
            const self = this;

            field.on('input', function() {
                const fieldValue = $(this).val();

                self.saveFieldData($(this), fieldValue);
            });
        },

        bindFieldTextarea: function(field) {
            this.bindFieldText(field);
        },

        bindFieldCheckbox: function(field) {
            const self = this;

            field.on('click', function() {
                const fieldValue = $(this).is(':checked') ? 1 : 0;

                self.saveFieldData($(this), fieldValue);
            });
        },

        bindFieldRadio: function(field) {
            const self = this;

            field.on('click', function() {
                if ($(this).is(':checked')) {
                    const fieldValue = $(this).val();

                    self.saveFieldData($(this), fieldValue);
                }
            });
        },

        bindFieldSelect: function(field) {
            const self = this;

            field.on('change', function() {
                const fieldValue = $(this).val();

                self.saveFieldData($(this), fieldValue);
            });
        },

        getStorageData: function() {
            const rawStorageData = window.localStorage.getItem('formData');
            return rawStorageData ? JSON.parse(rawStorageData) : {};
        },

        saveStorageData: function(storageData) {
            window.localStorage.setItem('formData', JSON.stringify(storageData));
        },

        getFormData: function() {
            const storageData = this.getStorageData();

            if (! storageData.hasOwnProperty(this.options.storageName)) {
                storageData[this.options.storageName] = {};
            }

            return storageData[this.options.storageName];
        },

        saveFormData: function(formData) {
            const storageData = this.getStorageData();

            storageData[this.options.storageName] = formData;

            this.saveStorageData(storageData);
        },

        getFieldData: function(fieldName) {
            const formData = this.getFormData();

            return formData.hasOwnProperty(fieldName) ? formData[fieldName] : null;
        },

        saveFieldData: function(field, fieldValue) {
            const formData = this.getFormData();

            const fieldName = field.attr('name');

            formData[fieldName] = fieldValue;

            this.saveFormData(formData);
        },

        restoreForm: function() {
            const self = this;

            $.each(self.options.textFields, function(index, selector) {
                self.element.find(selector).each(function() {
                    self.restoreFieldText($(this));
                });
            });

            $.each(self.options.textareaFields, function(index, selector) {
                self.element.find(selector).each(function() {
                    self.restoreFieldTextarea($(this));
                });
            });

            $.each(self.options.checkboxFields, function(index, selector) {
                self.element.find(selector).each(function() {
                    self.restoreFieldCheckbox($(this));
                });
            });

            $.each(self.options.radioFields, function(index, selector) {
                self.element.find(selector).each(function() {
                    self.restoreFieldRadio($(this));
                });
            });

            $.each(self.options.selectFields, function(index, selector) {
                self.element.find(selector).each(function() {
                    self.restoreFieldSelect($(this));
                });
            });
        },

        restoreField: function(field) {
            const self = this;

            $.each(self.options.textFields, function(index, selector) {
                if (field.is(selector)) {
                    self.restoreFieldText(field);
                }
            });

            $.each(self.options.textareaFields, function(index, selector) {
                if (field.is(selector)) {
                    self.restoreFieldTextarea(field);
                }
            });

            $.each(self.options.checkboxFields, function(index, selector) {
                if (field.is(selector)) {
                    self.restoreFieldCheckbox(field);
                }
            });

            $.each(self.options.radioFields, function(index, selector) {
                if (field.is(selector)) {
                    self.restoreFieldRadio(field);
                }
            });

            $.each(self.options.selectFields, function(index, selector) {
                if (field.is(selector)) {
                    self.restoreFieldSelect(field);
                }
            });
        },

        restoreFieldText: function(field) {
            const fieldName = field.attr('name');

            const fieldValue = this.getFieldData(fieldName);

            if (fieldValue !== null) {
                field.val(fieldValue);
                field.trigger('input');
                field.trigger('change');
            }
        },

        restoreFieldTextarea: function(field) {
            this.restoreFieldText(field);
        },

        restoreFieldCheckbox: function(field) {
            const fieldName = field.attr('name');

            const fieldValue = this.getFieldData(fieldName);

            if (fieldValue !== null) {
                if (fieldValue === 1) {
                    field.trigger('click');
                    field.trigger('change');
                }
            }
        },

        restoreFieldRadio: function(field) {
            const fieldName = field.attr('name');

            const fieldValue = this.getFieldData(fieldName);

            if (fieldValue !== null) {
                if (fieldValue === field.attr('value')) {
                    field.trigger('click');
                    field.trigger('change');
                }
            }
        },

        restoreFieldSelect: function(field) {
            const fieldName = field.attr('name');

            const fieldValue = this.getFieldData(fieldName);

            if (fieldValue !== null) {
                field.val(fieldValue);
                field.trigger('input');
                field.trigger('change');
            }
        },
    });

    return $.infrangible.formStorage;
});
