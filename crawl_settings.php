<?php $crawl_ophim_settings = json_decode(get_option(CRAWL_OPHIM_OPTION_SETTINGS, [])); ?>
<div class="filter_title"><strong>Bỏ qua định dạng</strong></div>
<div class="filter_item">
    <label><input type="checkbox" class="" name="filter_type[]" value="single"> Phim lẻ</label>
    <label><input type="checkbox" class="" name="filter_type[]" value="series"> Phim bộ</label>
    <label><input type="checkbox" class="" name="filter_type[]" value="hoathinh"> Hoạt hình</label>
    <label><input type="checkbox" class="" name="filter_type[]" value="tvshows"> Tv shows</label>
</div>

<div class="filter_title"><strong>Bỏ qua thể loại</strong></div>
<div class="filter_item">
    <?php
    foreach ($categoryFromApi as $category) {
        ?>
        <label><input type="checkbox" class="" name="filter_category[]" value="<?php echo $category->name; ?>">
            <?php echo $category->name; ?></label>
        <?php
    }
    ?>
</div>

<div class="filter_title"><strong>Bỏ qua quốc gia</strong></div>
<div class="filter_item">
    <?php
    foreach ($countryFromApi as $country) {
        ?>
        <label><input type="checkbox" class="" name="filter_country[]" value="<?php echo $country->name; ?>">
            <?php echo $country->name; ?></label>
        <?php
    }
    ?>
</div>
<div class="filter_title"><strong>Tùy chỉnh hình ảnh</strong></div>
<div>

    <label> <input type="checkbox" name="crawl_resize_size_thumb" <?php if (oIsset($crawl_ophim_settings, 'crawl_resize_size_thumb', 'off') == 'on') {
        echo 'checked';
    } ?> />Tải & Resize Thumb => </label>
    <label> Width (px): <input style="max-width: 80px" type="number" name="crawl_resize_size_thumb_w"
            value="<?php echo oIsset($crawl_ophim_settings, 'crawl_resize_size_thumb_w', 0); ?>" /></label>
    <label> Height (px): <input style="max-width: 80px" type="number" name="crawl_resize_size_thumb_h"
            value="<?php echo oIsset($crawl_ophim_settings, 'crawl_resize_size_thumb_h', 0); ?>" /></label>
</div>
<div style="margin-top: 5px">
    <label> <input type="checkbox" name="crawl_resize_size_poster" <?php if (oIsset($crawl_ophim_settings, 'crawl_resize_size_poster', 'off') == 'on') {
        echo 'checked';
    } ?> />Tải & Resize Poster =></label>
    <label> Width (px): <input style="max-width: 80px" type="number" name="crawl_resize_size_poster_w"
            value="<?php echo oIsset($crawl_ophim_settings, 'crawl_resize_size_poster_w', 0); ?>" /></label>
    <label> Height (px): <input style="max-width: 80px" type="number" name="crawl_resize_size_poster_h"
            value="<?php echo oIsset($crawl_ophim_settings, 'crawl_resize_size_poster_h', 0); ?>" /></label>
</div>
<div style="margin-top: 5px">
    <label> <input type="checkbox" name="crawl_convert_webp" <?php if (oIsset($crawl_ophim_settings, 'crawl_convert_webp', 'off') == 'on') {
        echo 'checked';
    } ?> />Lưu định dạng webp</label>
</div>
<p>
<div id="save_crawl_ophim_schedule" class="button">Lưu cấu hình cho crawl tự động</div>
</p>