window.SearcherDisplay = (function($) {
    /**
     * This class provides support for displaying quick search text results to users.
     */
    function SearcherDisplay() { }

    SearcherDisplay.prototype.init = function() {
        this._displayQuickSearch();
    };

    /**
     * This method creates the quick text search entry in navigation menu and wires all required events.
     */
    SearcherDisplay.prototype._displayQuickSearch = function() {
            var quickSearch = $(document.createElement("iframe")),
                   body = $("body"),
                   self = this;

        quickSearch.attr("id", "quicksearch");

            quickSearch.attr("src", "quicksearch.html");
            quickSearch.css("width", "0px");
            quickSearch.css("height", "0px");

            body.append(quickSearch);


            $(window).on("message", function(msg) {
                var msgData = msg.originalEvent.data;

                if (msgData.msgid != "docstrap.quicksearch.done") {
                    return;
                }

                var results = msgData.results || [];

                self._displaySearchResults(results);
            });

            function startSearch() {

               // console.log('fulltext-search-ui.js : startSearch():');

              var searchTerms = $('#search-input').prop("value");
              if (searchTerms) {
                quickSearch[0].contentWindow.postMessage({
                  "searchTerms": searchTerms,
                  "msgid": "docstrap.quicksearch.start"
                }, "*");
              }
            }


        SearcherDisplay.prototype.startSearch = startSearch;

    };

    /**
     * This method displays the quick text search results in a modal dialog.
     */
    SearcherDisplay.prototype._displaySearchResults = function(results) {

      //  console.log('_displaySearchResults: first result:' + results[0]);

            var resultsHolder = $($("#searchResults").find(".modal-body")),
                  fragment = document.createDocumentFragment(),
                  resultsList = document.createElement("ul");

            resultsHolder.empty();

            for (var idx = 0; idx < results.length; idx++) {
                        var result = results[idx],
                       item = document.createElement("li"),
                       link = document.createElement("a");

                        link.href = result.id;
                        link.innerHTML = result.title;

                        item.appendChild(link)
                        resultsList.appendChild(item);
            }

            fragment.appendChild(resultsList);
            resultsHolder.append(fragment);

        $("#searchResults").find('button.close').css('position', 'absolute').css('right', '18px');

        $("#searchResults").find('button.close,button[data-dismiss="modal"]').click(function(){

            //$(this).parents("#searchResults").find('.modal-dialog').hide();

            $("#searchResults").hide('fast');

        });

            $("#searchResults").show('fast');

    };

    return new SearcherDisplay();
})($);


