jQuery(function ($) {
    var filterType = JSON.parse(localStorage.getItem('filterType')) != null ? JSON.parse(localStorage.getItem('filterType')) : [];
    var filterCategory = JSON.parse(localStorage.getItem('filterCategory')) != null ? JSON.parse(localStorage.getItem('filterCategory')) : [];
    var filterCountry = JSON.parse(localStorage.getItem('filterCountry')) != null ? JSON.parse(localStorage.getItem('filterCountry')) : [];

    var page_from = localStorage.getItem('page_from') ? localStorage.getItem('page_from') : 10;
    var page_to = localStorage.getItem('page_to') ? localStorage.getItem('page_to') : 1;
    var url_nguonc_crawl = localStorage.getItem('url_nguonc_crawl') ? localStorage.getItem('url_nguonc_crawl') : 'https://phim.nguonc.com/api/films/phim-moi-cap-nhat';
    $('input[name=page_from]').val(page_from);
    $('input[name=url_nguonc_crawl]').val(url_nguonc_crawl);
    $('input[name=page_to]').val(page_to);

    var timeout_from = localStorage.getItem('timeout_from') ? localStorage.getItem('timeout_from') : 1000;
    var timeout_to = localStorage.getItem('timeout_to') ? localStorage.getItem('timeout_to') : 3000;
    $('input[name=timeout_from]').val(timeout_from);
    $('input[name=timeout_to]').val(timeout_to);

    $("input[name='filter_type[]']").each(function () {
        if (filterType.includes($(this).val())) {
            $(this).attr('checked', true);
        }
    });
    $("input[name='filter_category[]']").each(function () {
        if (filterCategory.includes($(this).val())) {
            $(this).attr('checked', true);
        }
    });
    $("input[name='filter_country[]']").each(function () {
        if (filterCountry.includes($(this).val())) {
            $(this).attr('checked', true);
        }
    });

    const buttonGetListMovies = $('div#get_list_movies');
    const inputPageFrom = $('input[name=page_from]');
    const inputPageTo = $('input[name=page_to]');
    // Nguonc
    const buttonGetListMoviesNguonc = $('div#get_list_movies_nguonc');
    const buttonCrawlMoviesNguonc = $('div#crawl_movies_nguonc');
    const inputSearch = $('input[name=key_search_nguonc]');
    const buttonSearchMoviesNguonc = $('div#search_movies_nguonc');
    // End Nguonc
    // Kkphimn
    const buttonGetListMoviesKKphim = $('div#get_list_movies_kkphim');
    const buttonCrawlMoviesKKphim = $('div#crawl_movies_kkphim');
    // End KKphim
    const divMsg = $('div#msg');
    const divMsgText = $('p#msg_text');
    const textArealistMovies = $('textarea#result_list_movies');
    const buttonCrawlMovies = $('div#crawl_movies');
    const buttonRollMovies = $('div#roll_movies');
    const divMsgCrawlSuccess = $('div#result_success');
    const divMsgCrawlError = $('div#result_error');
    const textAreaResultSuccess = $('textarea#list_crawl_success');
    const textAreaResultError = $('textarea#list_crawl_error');
    // Button custom
    const buttonGetListMoviesCustom = $('div#get_list_movies_custom');

    buttonRollMovies.on('click', () => {
        var listLink = textArealistMovies.val();
        listLink = listLink.split('\n');
        listLink.sort(() => Math.random() - 0.5);
        listLink = listLink.join('\n');
        textArealistMovies.val(listLink);
    });

    buttonGetListMovies.on('click', () => {
        divMsg.show(300);
        textArealistMovies.show(300);
        crawl_page_callback(inputPageFrom.val());
    });
    // Button search movie nguonc
    buttonSearchMoviesNguonc.on('click', () => {
        textArealistMovies.val('');
        if (inputSearch.val() == '') {
            alert('Hãy nhập tên phim!');
            return false;
        }
        divMsgText.html(`Đang tìm kiếm`);
        divMsg.show(300);
        $.ajax({
            url: ajaxurl,
            type: 'POST',
            data: {
                action: 'search_phim_nguonc',
                keyword: inputSearch.val()
            },
            beforeSend: function () {
                buttonSearchMoviesNguonc.hide(300);
            },
            success: function (res) {
                let currentList = textArealistMovies.val();
                if (currentList != '') currentList += '\n' + res;
                else currentList += res;

                textArealistMovies.val(currentList);
                divMsgText.html(`Xong`);
                buttonSearchMoviesNguonc.show(300);
            }
        });
    });
    // End button search movie nguonc
    // button get list movie nguonc
    buttonGetListMoviesNguonc.on('click', () => {
        divMsg.show(300);
        textArealistMovies.show(300);
        crawl_page_callback_nguonc(inputPageFrom.val());
    });
    // end button get list movie nguonc
    // button crawl movie custom
    buttonGetListMoviesCustom.on('click', () => {
        divMsg.show(300);
        divMsg.show(300);
        divMsgCrawlSuccess.show(300);
        divMsgCrawlError.show(300);
        const fileInput = document.getElementById('jsonUploadFile');
        const file = fileInput.files[0];
        if (!file) {
            alert('Vui lòng chọn file JSON!');
            return;
        }

        if (file.type !== 'application/json') {
            alert('File không hợp lệ! Chỉ chấp nhận JSON.');
            return;
        }
        const reader = new FileReader();

        reader.onload = function (event) {
            try {
                const jsonData = JSON.parse(event.target.result);

                if (!Array.isArray(jsonData)) {
                    console.log('JSON không phải array, dữ liệu:', jsonData);
                    return;
                }

                // Hàm gửi từng phim
                function sendMovie(index) {
                    if (index >= jsonData.length) {
                        divMsgText.html(`✅ Done`);
                        return;
                    }

                    const obj = jsonData[index];
                    divMsgText.html(`🔄 Đang crawl: ${obj.movie_name}`);

                    $.ajax({
                        url: ajaxurl,
                        type: 'POST',
                        data: {
                            action: 'crawl_link_custom',
                            listmovies: obj // gửi object JSON
                        },
                        success: function (res) {
                            let data = JSON.parse(res);
                            if (data.status) {
                                let currentList = textAreaResultSuccess.val(); // giá trị hiện tại
                                currentList = '✅ ' + obj.movie_name + (data.msg ? ' =====>> ' + data.msg : '') + (currentList ? '\n' + currentList : '');
                                textAreaResultSuccess.val(currentList); // cập nhật textarea success
                            } else {
                                let currentList = textAreaResultError.val(); // giá trị hiện tại
                                currentList = '❌ ' + obj.movie_name + ' =====>> ' + data.msg + (currentList ? '\n' + currentList : '');
                                textAreaResultError.val(currentList);
                            }

                            var wait_timeout = 1000;
                            if (data.wait) {
                                let timeout_from = $('input[name=timeout_from]').val();
                                let timeout_to = $('input[name=timeout_to]').val();
                                let maximum = Math.max(timeout_from, timeout_to);
                                let minimum = Math.min(timeout_from, timeout_to);
                                wait_timeout = Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
                            }
                            divMsgText.html(`Wait timeout ${wait_timeout}ms`);
                            setTimeout(() => {
                                sendMovie(index + 1);
                            }, wait_timeout);

                            // gửi phim tiếp theo
                        },
                        error: function (xhr) {
                            // tiếp tục gửi phim tiếp theo
                        }
                    });
                }

                // Bắt đầu gửi từ phim đầu tiên
                sendMovie(0);
            } catch (e) {
                console.error('❌ Lỗi parse JSON:', e);
            }
        };

        reader.readAsText(file, 'UTF-8');
        // duyệt qua phần từ trong object
        // listcrawl = JSON.parse(listcrawl);
        // let slugs = Object.keys(listcrawl);
        // let urlList = slugs.map((slug) => 'https://phim.nguonc.com/api/film/' + slug);
        // crawl_page_callback_custom(urlList);
    });
    // end button get list movie custom
    // function crawl_page_callback_nguonc
    const crawl_page_callback_nguonc = (currentPage) => {
        var url_page = $('input[name=url_nguonc_crawl]').val();
        var urlPageCrawl = `${url_page}?page=${currentPage}`;
        if (currentPage < inputPageTo.val()) {
            divMsgText.html('Done!');
            buttonCrawlMovies.show(300);
            return false;
        }
        divMsgText.html(`Crawl Page: ${urlPageCrawl}`);
        $.ajax({
            url: ajaxurl,
            type: 'POST',
            data: {
                action: 'crawl_ophim_page_nguonc',
                url: urlPageCrawl
            },
            beforeSend: function () {
                buttonGetListMoviesNguonc.hide(300);
            },
            success: function (res) {
                let currentList = textArealistMovies.val();
                if (currentList != '') currentList += '\n' + res;
                else currentList += res;

                textArealistMovies.val(currentList);
                currentPage--;
                crawl_page_callback_nguonc(currentPage);
            }
        });
    };
    //end function crawl_page_callback_nguonc
    // button get list movie kkphim
    buttonGetListMoviesKKphim.on('click', () => {
        divMsg.show(300);
        textArealistMovies.show(300);
        crawl_page_callback_kkphim(inputPageFrom.val());
    });
    // end button get list movie kkphim
    // function crawl_page_callback_kkphim
    const crawl_page_callback_kkphim = (currentPage) => {
        var urlPageCrawl = `https://phimapi.com/danh-sach/phim-moi-cap-nhat?page=${currentPage}`;
        if (currentPage < inputPageTo.val()) {
            divMsgText.html('Done!');
            buttonCrawlMovies.show(300);
            return false;
        }
        divMsgText.html(`Crawl KKPhim Page: ${urlPageCrawl}`);
        $.ajax({
            url: ajaxurl,
            type: 'POST',
            data: {
                action: 'crawl_ophim_page_kkphim',
                url: urlPageCrawl
            },
            beforeSend: function () {
                buttonGetListMoviesKKphim.hide(300);
            },
            success: function (res) {
                let currentList = textArealistMovies.val();
                if (currentList != '') currentList += '\n' + res;
                else currentList += res;

                textArealistMovies.val(currentList);
                currentPage--;
                crawl_page_callback_kkphim(currentPage);
            }
        });
    };
    //end function crawl_page_callback_kkphim
    const crawl_page_callback = (currentPage) => {
        var urlPageCrawl = `https://ophim1.com/danh-sach/phim-moi-cap-nhat?page=${currentPage}`;

        if (currentPage < inputPageTo.val()) {
            divMsgText.html('Done!');
            buttonCrawlMovies.show(300);
            return false;
        }
        divMsgText.html(`Crawl Page: ${urlPageCrawl}`);
        $.ajax({
            url: ajaxurl,
            type: 'POST',
            data: {
                action: 'crawl_ophim_page',
                url: urlPageCrawl
            },
            beforeSend: function () {
                buttonGetListMovies.hide(300);
            },
            success: function (res) {
                let currentList = textArealistMovies.val();
                if (currentList != '') currentList += '\n' + res;
                else currentList += res;

                textArealistMovies.val(currentList);
                currentPage--;
                crawl_page_callback(currentPage);
            }
        });
    };

    var inputFilterType = [];
    var inputFilterCategory = [];
    var inputFilterCountry = [];
    // button crawl movide  kkphim
    buttonCrawlMoviesKKphim.on('click', () => {
        divMsg.show(300);
        divMsgCrawlSuccess.show(300);
        divMsgCrawlError.show(300);

        $("input[name='filter_type[]']:checked").each(function () {
            inputFilterType.push($(this).val());
        });
        $("input[name='filter_category[]']:checked").each(function () {
            inputFilterCategory.push($(this).val());
        });
        $("input[name='filter_country[]']:checked").each(function () {
            inputFilterCountry.push($(this).val());
        });

        crawl_movies_kkphim(false);
    });
    // end button crawl movide kkphim
    // function crawl movies kkphim
    const crawl_movies_kkphim = () => {
        var listLink = textArealistMovies.val();
        listLink = listLink.split('\n');
        let linkCurrent = listLink.shift();
        if (linkCurrent == '') {
            divMsgText.html(`Crawl Done!`);
            return false;
        }
        listLink = listLink.join('\n');
        textArealistMovies.val(listLink);
        divMsgText.html(`Crawl KKPhim Movies: <b>${linkCurrent}</b>`);

        $.ajax({
            url: ajaxurl,
            type: 'POST',
            data: {
                action: 'crawl_kkphim_movies',
                url: linkCurrent,
                filterType: inputFilterType,
                filterCategory: inputFilterCategory,
                filterCountry: inputFilterCountry
            },
            beforeSend: function () {
                buttonCrawlMoviesKKphim.hide(300);
                buttonRollMovies.hide(300);
            },
            success: function (res) {
                let data = JSON.parse(res);
                if (data.status) {
                    let currentList = textAreaResultSuccess.val();
                    if (currentList != '') currentList += '\n' + linkCurrent;
                    else currentList += linkCurrent;
                    textAreaResultSuccess.val(currentList);
                } else {
                    let currentList = textAreaResultError.val();
                    if (currentList != '') currentList += '\n' + linkCurrent;
                    else currentList += linkCurrent;
                    textAreaResultError.val(currentList + '=====>>' + data.msg);
                }

                var wait_timeout = 1000;
                if (data.wait) {
                    let timeout_from = $('input[name=timeout_from]').val();
                    let timeout_to = $('input[name=timeout_to]').val();
                    let maximum = Math.max(timeout_from, timeout_to);
                    let minimum = Math.min(timeout_from, timeout_to);
                    wait_timeout = Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
                }
                divMsgText.html(`Wait timeout ${wait_timeout}ms`);
                setTimeout(() => {
                    crawl_movies_kkphim();
                }, wait_timeout);
            },
            error: function (xhr, ajaxOptions, thrownError) {
                textAreaResultError.val('Thất bại');
                let currentList = textAreaResultError.val();
                if (currentList != '') currentList += '\n' + linkCurrent;
                else currentList += linkCurrent;
                textAreaResultError.val(currentList);

                crawl_movies_kkphim();
            }
        });
    };
    // end function crawl movies kkphinm
    // button crawl movide  nguonc
    buttonCrawlMoviesNguonc.on('click', () => {
        divMsg.show(300);
        divMsgCrawlSuccess.show(300);
        divMsgCrawlError.show(300);

        $("input[name='filter_type[]']:checked").each(function () {
            inputFilterType.push($(this).val());
        });
        $("input[name='filter_category[]']:checked").each(function () {
            inputFilterCategory.push($(this).val());
        });
        $("input[name='filter_country[]']:checked").each(function () {
            inputFilterCountry.push($(this).val());
        });
        crawl_movies_nguonc(false);
    });
    // end button crawl movide nguonc
    // function crawl movies nugonc
    const crawl_movies_nguonc = () => {
        var listLink = textArealistMovies.val();
        listLink = listLink.split('\n');
        let linkCurrent = listLink.shift();
        if (linkCurrent == '') {
            divMsgText.html(`Crawl Done!`);
            return false;
        }
        listLink = listLink.join('\n');
        textArealistMovies.val(listLink);
        divMsgText.html(`Crawl Movies: <b>${linkCurrent}</b>`);
        $.ajax({
            url: ajaxurl,
            type: 'POST',
            data: {
                action: 'crawl_ophim_movies_nguonc',
                url: linkCurrent,
                filterType: inputFilterType,
                filterCategory: inputFilterCategory,
                filterCountry: inputFilterCountry
            },
            beforeSend: function () {
                buttonCrawlMoviesNguonc.hide(300);
                buttonRollMovies.hide(300);
            },
            success: function (res) {
                let data = JSON.parse(res);
                if (data.status) {
                    let currentList = textAreaResultSuccess.val();
                    if (currentList != '') currentList += '\n' + linkCurrent;
                    else currentList += linkCurrent;
                    textAreaResultSuccess.val(currentList);
                } else {
                    let currentList = textAreaResultError.val();
                    if (currentList != '') currentList += '\n' + linkCurrent;
                    else currentList += linkCurrent;
                    textAreaResultError.val(currentList + '=====>>' + data.msg);
                }

                var wait_timeout = 1000;
                if (data.wait) {
                    let timeout_from = $('input[name=timeout_from]').val();
                    let timeout_to = $('input[name=timeout_to]').val();
                    let maximum = Math.max(timeout_from, timeout_to);
                    let minimum = Math.min(timeout_from, timeout_to);
                    wait_timeout = Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
                }
                divMsgText.html(`Wait timeout ${wait_timeout}ms`);
                setTimeout(() => {
                    crawl_movies_nguonc();
                }, wait_timeout);
            },
            error: function (xhr, ajaxOptions, thrownError) {
                textAreaResultError.val('Thất bại');
                let currentList = textAreaResultError.val();
                if (currentList != '') currentList += '\n' + linkCurrent;
                else currentList += linkCurrent;
                textAreaResultError.val(currentList);

                crawl_movies_nguonc();
            }
        });
    };
    // end function crawl movies nguonc
    buttonCrawlMovies.on('click', () => {
        divMsg.show(300);
        divMsgCrawlSuccess.show(300);
        divMsgCrawlError.show(300);

        $("input[name='filter_type[]']:checked").each(function () {
            inputFilterType.push($(this).val());
        });
        $("input[name='filter_category[]']:checked").each(function () {
            inputFilterCategory.push($(this).val());
        });
        $("input[name='filter_country[]']:checked").each(function () {
            inputFilterCountry.push($(this).val());
        });

        crawl_movies(false);
    });
    const crawl_movies = () => {
        var listLink = textArealistMovies.val();
        listLink = listLink.split('\n');
        let linkCurrent = listLink.shift();
        if (linkCurrent == '') {
            divMsgText.html(`Crawl Done!`);
            return false;
        }
        listLink = listLink.join('\n');
        textArealistMovies.val(listLink);
        divMsgText.html(`Crawl Movies: <b>${linkCurrent}</b>`);

        $.ajax({
            url: ajaxurl,
            type: 'POST',
            data: {
                action: 'crawl_ophim_movies',
                url: linkCurrent,
                filterType: inputFilterType,
                filterCategory: inputFilterCategory,
                filterCountry: inputFilterCountry
            },
            beforeSend: function () {
                buttonCrawlMovies.hide(300);
                buttonRollMovies.hide(300);
            },
            success: function (res) {
                let data = JSON.parse(res);
                if (data.status) {
                    let currentList = textAreaResultSuccess.val();
                    if (currentList != '') currentList += '\n' + linkCurrent;
                    else currentList += linkCurrent;
                    textAreaResultSuccess.val(currentList);
                } else {
                    let currentList = textAreaResultError.val();
                    if (currentList != '') currentList += '\n' + linkCurrent;
                    else currentList += linkCurrent;
                    textAreaResultError.val(currentList + '=====>>' + data.msg);
                }

                var wait_timeout = 1000;
                if (data.wait) {
                    let timeout_from = $('input[name=timeout_from]').val();
                    let timeout_to = $('input[name=timeout_to]').val();
                    let maximum = Math.max(timeout_from, timeout_to);
                    let minimum = Math.min(timeout_from, timeout_to);
                    wait_timeout = Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
                }
                divMsgText.html(`Wait timeout ${wait_timeout}ms`);
                setTimeout(() => {
                    crawl_movies();
                }, wait_timeout);
            },
            error: function (xhr, ajaxOptions, thrownError) {
                let currentList = textAreaResultError.val();
                if (currentList != '') currentList += '\n' + linkCurrent;
                else currentList += linkCurrent;
                textAreaResultError.val(currentList);

                crawl_movies();
            }
        });
    };

    $("input[name='filter_type[]']").change(() => {
        var saveFilterData = [];
        $("input[name='filter_type[]']:checked").each(function () {
            saveFilterData.push($(this).val());
        });
        localStorage.setItem('filterType', JSON.stringify(saveFilterData));
    });

    $("input[name='filter_category[]']").change(() => {
        var saveFilterData = [];
        $("input[name='filter_category[]']:checked").each(function () {
            saveFilterData.push($(this).val());
        });
        localStorage.setItem('filterCategory', JSON.stringify(saveFilterData));
    });

    $("input[name='filter_country[]']").change(() => {
        var saveFilterData = [];
        $("input[name='filter_country[]']:checked").each(function () {
            saveFilterData.push($(this).val());
        });
        localStorage.setItem('filterCountry', JSON.stringify(saveFilterData));
    });

    $('input[name=page_from]').change((e) => {
        localStorage.setItem('page_from', $('input[name=page_from]').val());
    });
    $('input[name=page_to]').change((e) => {
        localStorage.setItem('page_to', $('input[name=page_to]').val());
    });
    $('input[name=url_nguonc_crawl]').change((e) => {
        localStorage.setItem('url_nguonc_crawl', $('input[name=url_nguonc_crawl]').val());
    });
    $('input[name=timeout_from]').change((e) => {
        localStorage.setItem('timeout_from', $('input[name=timeout_from]').val());
    });
    $('input[name=timeout_to]').change((e) => {
        localStorage.setItem('timeout_to', $('input[name=timeout_to]').val());
    });

    // Crawler Schedule
    $('#save_crawl_ophim_schedule').on('click', () => {
        let pageFrom = $('input[name=page_from]').val();
        let pageTo = $('input[name=page_to]').val();
        let url_nguonc_post = $('input[name=url_nguonc_crawl]').val();
        let crawl_resize_size_thumb = $('input[name=crawl_resize_size_thumb]:checked').val();
        let crawl_resize_size_thumb_w = $('input[name=crawl_resize_size_thumb_w]').val();
        let crawl_resize_size_thumb_h = $('input[name=crawl_resize_size_thumb_h]').val();
        let crawl_resize_size_poster = $('input[name=crawl_resize_size_poster]:checked').val();
        let crawl_resize_size_poster_w = $('input[name=crawl_resize_size_poster_w]').val();
        let crawl_resize_size_poster_h = $('input[name=crawl_resize_size_poster_h]').val();
        let crawl_convert_webp = $('input[name=crawl_convert_webp]:checked').val();
        let filterType = [];
        $("input[name='filter_type[]']:checked").each(function () {
            filterType.push($(this).val());
        });

        let filterCategory = [];
        $("input[name='filter_category[]']:checked").each(function () {
            filterCategory.push($(this).val());
        });

        let filterCountry = [];
        $("input[name='filter_country[]']:checked").each(function () {
            filterCountry.push($(this).val());
        });

        $.ajax({
            url: ajaxurl,
            type: 'POST',
            data: {
                action: 'crawl_ophim_save_settings',
                pageFrom,
                pageTo,
                crawl_resize_size_thumb,
                crawl_resize_size_thumb_w,
                crawl_resize_size_thumb_h,
                crawl_resize_size_poster,
                crawl_resize_size_poster_w,
                crawl_resize_size_poster_h,
                crawl_convert_webp,
                filterType,
                filterCategory,
                filterCountry,
                url_nguonc_post
            },
            success: function (res) {
                alert('Lưu thành công!');
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert('Lưu cấu hình thất bại!');
            }
        });
    });
    $('#crawl_ophim_schedule_enable').on('click', (e) => {
        let enable = $('#crawl_ophim_schedule_enable').is(':checked');
        $.ajax({
            url: ajaxurl,
            type: 'POST',
            data: {
                action: 'crawl_ophim_schedule_enable',
                enable
            },
            success: function (res) {},
            error: function (xhr, ajaxOptions, thrownError) {}
        });
    });
    $('#save_crawl_auto').on('click', (e) => {
        // let enable = $("#crawl_ophim_schedule_enable").is(":checked");
        let select_source = $('input[name="crawl_ophim_radio"]:checked').val();
        $.ajax({
            url: ajaxurl,
            type: 'POST',
            data: {
                action: 'crawl_ophim_schedule_select',
                select_source
            },
            success: function (res) {
                alert('Lưu thành công!');
            },
            error: function (xhr, ajaxOptions, thrownError) {}
        });
    });
    $('#save_crawl_ophim_schedule_secret').on('click', (e) => {
        let secret_key = $("input[name='crawl_ophim_schedule_secret']").val();
        $.ajax({
            url: ajaxurl,
            type: 'POST',
            data: {
                action: 'save_crawl_ophim_schedule_secret',
                secret_key
            },
            success: function (res) {
                alert('Lưu thành công!');
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert('Lưu thất bại!');
            }
        });
    });
});
