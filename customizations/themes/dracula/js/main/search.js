/* SPDX-License-Identifier: AGPL-3.0-or-later */
/* exported AutoComplete */

(function (w, d, searxng) {
  'use strict';

  var qinput_id = "q", qinput;

  const isMobile = window.matchMedia("only screen and (max-width: 50em)").matches;
  const isResultsPage = document.querySelector("main").id == "main_results";

  function submitIfQuery () {
    if (qinput.value.length  > 0) {
      var search = document.getElementById('search');
      setTimeout(search.submit.bind(search), 0);
    }
  }

  function createClearButton (qinput) {
    var cs = document.getElementById('clear_search');
    var updateClearButton = function () {
      if (qinput.value.length === 0) {
        cs.classList.add("empty");
      } else {
        cs.classList.remove("empty");
      }
    };

    // update status, event listener
    updateClearButton();
    cs.addEventListener('click', function (ev) {
      qinput.value = '';
      qinput.focus();
      updateClearButton();
      ev.preventDefault();
    });
    qinput.addEventListener('input', updateClearButton, false);
  }

  // Store last results to show when refocusing
  let lastResults = null;
  let lastQuery = '';

  // Debounce function
  function debounce(func, delay) {
    let timeout;
    return function(...args) {
      const context = this;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), delay);
    };
  }

  const fetchResults = async (query) => {
    let request;
    if (searxng.settings.method === 'GET') {
      const reqParams = new URLSearchParams();
      reqParams.append("q", query);
      request = fetch("./autocompleter?" + reqParams.toString());
    } else {
      const formData = new FormData();
      formData.append("q", query);
      request = fetch("./autocompleter", {
        method: 'POST',
        body: formData,
      });
    }

    request.then(async function (response) {
      const results = await response.json();

      if (!results) return;

      // Store results for later use
      lastResults = results;
      lastQuery = query;

      const autocomplete = d.querySelector(".search_box .autocomplete");
      const autocompleteList = d.querySelector(".search_box .autocomplete ul");
      
      // Only show if input still has focus and query matches
      if (document.activeElement === qinput && qinput.value.trim() === query) {
        if (!results[1] || results[1].length == 0) {
          hideAutocomplete();
          return;
        }

        autocomplete.classList.add("open");
        autocompleteList.innerHTML = "";

        for (let result of results[1]) {
          const li = document.createElement("li");
          li.innerText = result;

          searxng.on(li, 'mousedown', () => {
            qinput.value = result;
            const form = d.querySelector("#search");
            form.submit();
            autocomplete.classList.remove('open');
          });

          // Add hover effect
          searxng.on(li, 'mouseenter', () => {
            // Remove active class from all items
            autocompleteList.querySelectorAll('li').forEach(item => {
              item.classList.remove('active');
            });
            li.classList.add('active');
          });

          autocompleteList.appendChild(li);
        }
      }
    }).catch(error => {
      console.log('Autocomplete fetch error:', error);
    });
  };

  function hideAutocomplete() {
    const autocomplete = d.querySelector(".search_box .autocomplete");
    if (autocomplete) {
      autocomplete.classList.remove('open');
      // Clear suggestions to avoid lingering old items next time
      const list = autocomplete.querySelector('ul');
      if (list) list.innerHTML = '';
    }
  }

  searxng.ready(function () {
    // focus search input on large screens
    if (!isMobile && !isResultsPage) document.getElementById("q").focus();

    qinput = d.getElementById(qinput_id);
    const autocomplete = d.querySelector(".search_box .autocomplete");
    const autocompleteList = d.querySelector(".search_box .autocomplete ul");

    if (qinput !== null && autocomplete !== null) {
      // clear button
      createClearButton(qinput);

      // autocompleter
      if (searxng.settings.autocomplete) {
        // PERFECT: Hide autocomplete when clicking outside the search box
        searxng.on(document, 'click', (e) => {
          const searchBox = qinput.closest('.search_box');
          if (!searchBox || (!searchBox.contains(e.target) && !autocomplete.contains(e.target))) {
            hideAutocomplete();
          }
        });

        // PERFECT: Hide autocomplete when input loses focus
        searxng.on(qinput, 'blur', (e) => {
          // Small delay to allow clicking on autocomplete items
          setTimeout(() => {
            if (!autocomplete.matches(':hover')) {
              hideAutocomplete();
            }
          }, 200);
        });

        // Show autocomplete when input gains focus (if there are cached results)
        searxng.on(qinput, 'focus', () => {
          const query = qinput.value.trim();
          const minChars = searxng.settings.autocomplete_min || 2;
          
          if (query.length >= minChars) {
            // If we have cached results for this query, show them immediately
            if (lastQuery === query && lastResults && lastResults[1] && lastResults[1].length > 0) {
              autocomplete.classList.add("open");
              autocompleteList.innerHTML = "";

              if (!lastResults[1] || lastResults[1].length == 0) {
                hideAutocomplete();
                return;
              }

              for (let result of lastResults[1]) {
                const li = document.createElement("li");
                li.innerText = result;

                searxng.on(li, 'mousedown', () => {
                  qinput.value = result;
                  const form = d.querySelector("#search");
                  form.submit();
                  autocomplete.classList.remove('open');
                });

                searxng.on(li, 'mouseenter', () => {
                  autocompleteList.querySelectorAll('li').forEach(item => {
                    item.classList.remove('active');
                  });
                  li.classList.add('active');
                });

                autocompleteList.appendChild(li);
              }
            } else {
              // Fetch new results
              debounceFetch(query);
            }
          }
        });

        const debounceFetch = debounce((query) => {
          if (query === qinput.value.trim()) {
            fetchResults(query);
          }
        }, 250);

        // PERFECT: Handle input changes with proper minimum character check
        searxng.on(qinput, 'input', () => {
          const query = qinput.value.trim();
          const minChars = searxng.settings.autocomplete_min || 2;
          
          if (query.length < minChars) {
            hideAutocomplete();
            lastResults = null;
            lastQuery = '';
            return;
          }

          debounceFetch(query);
        });

        // Handle keyboard navigation
        searxng.on(qinput, 'keydown', (e) => {
          if (!autocomplete.classList.contains('open')) return;

          let currentIndex = -1;
          const listItems = autocompleteList.children;
          for (let i = 0; i < listItems.length; i++) {
            if (listItems[i].classList.contains('active')) {
              currentIndex = i;
              break;
            }
          }

          let newCurrentIndex = -1;
          if (e.key === "ArrowUp") {
            e.preventDefault(); // Prevent cursor movement
            if (currentIndex >= 0) listItems[currentIndex].classList.remove('active');
            newCurrentIndex = (currentIndex - 1 + listItems.length) % listItems.length;
          } else if (e.key === "ArrowDown") {
            e.preventDefault(); // Prevent cursor movement
            if (currentIndex >= 0) listItems[currentIndex].classList.remove('active');
            newCurrentIndex = (currentIndex + 1) % listItems.length;
          } else if (e.key === "Enter") {
            if (currentIndex >= 0) {
              e.preventDefault();
              const selectedItem = listItems[currentIndex];
              if (!selectedItem.classList.contains('no-item-found')) {
                qinput.value = selectedItem.innerText;
                const form = d.querySelector("#search");
                form.submit();
              }
            }
            hideAutocomplete();
          } else if (e.key === "Tab") {
            if (currentIndex >= 0) {
              e.preventDefault();
              const selectedItem = listItems[currentIndex];
              if (!selectedItem.classList.contains('no-item-found')) {
                qinput.value = selectedItem.innerText;
              }
            }
            hideAutocomplete();
          } else if (e.key === "Escape") {
            hideAutocomplete();
            qinput.blur();
          }

          if (newCurrentIndex !== -1) {
            const selectedItem = listItems[newCurrentIndex];
            selectedItem.classList.add('active');
          }
        });

        // Also hide on touchstart for mobile devices
        searxng.on(document, 'touchstart', (e) => {
          const searchBox = qinput.closest('.search_box');
          if (!searchBox || (!searchBox.contains(e.target) && !autocomplete.contains(e.target))) {
            hideAutocomplete();
          }
        });
      }
    }

    // Additionally to searching when selecting a new category, we also
    // automatically start a new search request when the user changes a search
    // filter (safesearch, time range or language) (this requires JavaScript
    // though)
    if (
      qinput !== null
        && searxng.settings.search_on_category_select
      // If .search_filters is undefined (invisible) we are on the homepage and
      // hence don't have to set any listeners
        && d.querySelector(".search_filters") != null
    ) {
      searxng.on(d.getElementById('safesearch'), 'change', submitIfQuery);
      searxng.on(d.getElementById('time_range'), 'change', submitIfQuery);
      searxng.on(d.getElementById('language'), 'change', submitIfQuery);
    }

    const categoryButtons = d.querySelectorAll("button.category_button");
    for (let button of categoryButtons) {
      searxng.on(button, 'click', (event) => {
        if (event.shiftKey) {
          event.preventDefault();
          button.classList.toggle("selected");
          return;
        }

        // manually deselect the old selection when a new category is selected
        const selectedCategories = d.querySelectorAll("button.category_button.selected");
        for (let categoryButton of selectedCategories) {
          categoryButton.classList.remove("selected");
        }
        button.classList.add("selected");
      });
    }

    // override form submit action to update the actually selected categories
    const form = d.querySelector("#search");
    if (form != null) {
      searxng.on(form, 'submit', (event) => {
        event.preventDefault();
        const categoryValuesInput = d.querySelector("#selected-categories");
        if (categoryValuesInput) {
          let categoryValues = [];
          for (let categoryButton of categoryButtons) {
            if (categoryButton.classList.contains("selected")) {
              categoryValues.push(categoryButton.name.replace("category_", ""));
            }
          }
          categoryValuesInput.value = categoryValues.join(",");
        }
        form.submit();
      });
    }
  });

})(window, document, window.searxng);