<template>
    <Layout>
        <div class="list-js-search">
            <label class="search-label-hidden" for="search">Search by country</label>
            <input class="search" type="text" id="search" placeholder="Search by country" />
            <i class="fas fa-search-location"></i>
        </div>
    </Layout>
</template>

<script>
export default {
    mounted() {
        window.$ = require("jquery");
        this.searchCountries();
    },
    methods: {
        searchCountries: function() {
            $("#results-not-found").hide();
            $("#search").keyup(function() {
                var text = $(this)
                .val()
                .toLowerCase();
                if (text.length === 0) {
                $("#tab-choose .btn-country").click();
                }
                $(".content").hide();
                var resultCount = 0;
                $("#results-not-found").hide();
                $(".content .country-names").each(function() {
                if (
                    $(this)
                    .text()
                    .toLowerCase()
                    .indexOf("" + text + "") != -1
                ) {
                    $(this)
                    .closest(".content")
                    .show();
                    $("#results-not-found").hide();
                    resultCount++;
                }

                if (resultCount == 0) {
                    $("#results-not-found").show();
                }
                });
            });
        }
    }
}
</script>