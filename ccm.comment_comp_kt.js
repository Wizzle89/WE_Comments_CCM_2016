/*
 Die Kommentar Komponente wurde auf Basis der Chat Komponente von Andre Kless entwickelt.

 */

ccm.component({

    name: 'comment_comp_kt',

    config: {

        html: [ccm.store, {local: 'comment_comp_kt.json'}],
        key: 'test',
        store: [ccm.store, {url: 'ws://ccm2.inf.h-brs.de/index.js', store: 'comment_comp_kt'}],
        style: [ccm.load, 'comment_comp_kt.css'],
        user: [ccm.instance, 'https://kaul.inf.h-brs.de/ccm/components/user2.js']

    },


    Instance: function () {


        var self = this;

        self.init = function (callback) {

            self.store.onChange = function () {
                self.render();
            };

            callback();

        };

        self.render = function (callback) {

            var element = ccm.helper.element(self);

            self.store.get(self.key, function (dataset) {

                if (dataset === null)
                    self.store.set({key: self.key, comments: []}, proceed);
                else
                    proceed(dataset);

                function proceed(dataset) {

                    element.html(ccm.helper.html(self.html.get('main')));

                    var comments_div = ccm.helper.find(self, '.comments');

                    comments_div.append(ccm.helper.html(self.html.get('input'), {
                        onsubmit: function () {

                            var value = ccm.helper.val(ccm.helper.find(self, 'input').val()).trim();

                            if (value === '') return;

                            self.user.login(function () {

                                dataset.comments.push({user: self.user.data().key, text: value});

                                self.store.set(dataset, function () {
                                    self.render();
                                });

                            });

                            return false;

                        }
                    }));
/*
    Darstellung der vorhandenen Kommentare: absteigend von der neusten zur aeltesten.
 */
                    for (var i = dataset.comments.length - 1; 0 < i; i--) {

                        var comment = dataset.comments[i];

                        comments_div.append(ccm.helper.html(self.html.get('comment'), {

                            name: ccm.helper.val(comment.user),
                            text: ccm.helper.val(comment.text)

                        }));

                    }


                    if (callback) callback();

                }

            });

        };

    }

});