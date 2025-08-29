<?php
add_action('admin_menu', 'tool_add_menu');
function tool_add_menu()
{
	add_menu_page(
		'Tool Crawl Phim',
		'Crawl Phim Tool',
		'manage_options',
		'crawl-ophim-tools',
		'crawl_tools',
		'',
		'2'
	);
}

function crawl_tools()
{
	$cache_time = 24 * HOUR_IN_SECONDS; // 86400 giây

	// Lấy danh mục phim
	$categoryFromApi = get_transient('ophim_theloai');
	if ($categoryFromApi === false) {
		$categoryFromApi = file_get_contents(API_DOMAIN . "/the-loai");
		set_transient('ophim_theloai', $categoryFromApi, $cache_time);
	}
	$categoryFromApi = json_decode($categoryFromApi);

	// Lấy quốc gia
	$countryFromApi = get_transient('ophim_quocgia');
	if ($countryFromApi === false) {
		$countryFromApi = file_get_contents(API_DOMAIN . "/quoc-gia");
		set_transient('ophim_quocgia', $countryFromApi, $cache_time);
	}
	$countryFromApi = json_decode($countryFromApi);
	?>

	<?php
	$default_tab = null;
	$tab = isset($_GET['tab']) ? $_GET['tab'] : $default_tab;
	?>

	<div class="wrap">
		<nav class="nav-tab-wrapper">
			<a href="?page=crawl-ophim-tools"
				class="nav-tab <?php if ($tab === null): ?>nav-tab-active<?php endif; ?>">Crawl Nguonc</a>
			<a href="?page=crawl-ophim-tools&tab=ophim"
				class="nav-tab <?php if ($tab === 'ophim'): ?>nav-tab-active<?php endif; ?>">Crawl Ophim</a>
			<a href="?page=crawl-ophim-tools&tab=kkphim"
				class="nav-tab <?php if ($tab === 'kkphim'): ?>nav-tab-active<?php endif; ?>">Crawl KKPhim</a>
			<a href="?page=crawl-ophim-tools&tab=schedule"
				class="nav-tab <?php if ($tab === 'schedule'): ?>nav-tab-active<?php endif; ?>">Tự động</a>
			<a href="?page=crawl-ophim-tools&tab=about"
				class="nav-tab <?php if ($tab === 'about'): ?>nav-tab-active<?php endif; ?>">Giới thiệu</a>
			<a href="?page=crawl-ophim-tools&tab=custom"
				class="nav-tab <?php if ($tab === 'custom'): ?>nav-tab-active<?php endif; ?>">Crawl Custom</a>
		</nav>
		<div class="tab-content">
			<?php
			switch ($tab):
				case 'schedule':
					$crawl_ophim_settings = json_decode(get_option(CRAWL_OPHIM_OPTION_SETTINGS, []));
					$schedule_log = getLastLog();
					?>

					<div class="crawl_page">
						<div class="postbox">
							<div class="inside">
								<b>Hưỡng dẫn cấu hình crontab</b>
								<div>
									<p>
										Thời gian thực hiện (<a href="https://crontab.guru/" target="_blank">Xem thêm</a>)
									</p>
									<p>
										Cấu hình crontab:
										<code><i style="color:blueviolet">*/10 * * * *</i> cd <i style="color:blueviolet">/path/to/</i>wp-content/plugins/crawl_ophim_halimthemes/ && php -q schedule.php <i style="color:blueviolet">{secret_key}</i></code>
									</p>
									<p>
										Đới với AAPanel:
										<br />
										Truy cập vào AAPanel Server -> Chọn mục Cron -> Chọn Add Task -> Dán dòng lệnh dưới đây vào
										phần Script content <br />
										<code> cd <?php echo CRAWL_OPHIM_PATH; ?> && php -q schedule.php <i style="color:blueviolet"><?php echo get_option(CRAWL_OPHIM_OPTION_SECRET_KEY, ''); ?></i></code>
									</p>
									<p>Đối với Hocvps hoặc các control panel khác: <br />Mở terminal nhập
										<code>EDITOR=nano crontab -e</code> rồi dán dòng lệnh bên dưới vào -> Nhấn Ctrl+O Enter lưu
										lại -> Ctrl+X để thoát <br />
										Crawl vào lúc 2h00 mỗi ngày:
										<code>0 2 * * * cd <?php echo CRAWL_OPHIM_PATH; ?> && php -q schedule.php <i style="color:blueviolet"><?php echo get_option(CRAWL_OPHIM_OPTION_SECRET_KEY, ''); ?></i></code>
									</p>
								</div>
							</div>
						</div>


						<div class="crawl_page">
							<div class="postbox">
								<div class="inside">
									<b>Cấu hình tự động</b>
									<div>
										<p>
											Secret Key: <input type="text" name="crawl_ophim_schedule_secret"
												value="<?php echo get_option(CRAWL_OPHIM_OPTION_SECRET_KEY, ''); ?>">
											<button id="save_crawl_ophim_schedule_secret" class="button">Lưu mật khẩu</button>
										</p>
									</div>


								</div>
							</div>
							<div class="postbox">
								<div class="inside">

									<b>Chọn nguồn phim để auto :</b>
									<label>
										<input type="radio" class="wppd-ui-toggle" name="crawl_ophim_radio" value="ophim" <?php echo (json_decode(file_get_contents(CRAWL_OPHIM_PATH_SCHEDULE_JSON))->enable_ophim === true) ? 'checked' : ''; ?>> OPhim

									</label>
									<label>
										<?php
										$schedule_data = @json_decode(@file_get_contents(CRAWL_OPHIM_PATH_SCHEDULE_JSON), true) ?: [];
										?>
										<input type="radio" class="wppd-ui-toggle" name="crawl_ophim_radio" value="kkphim"
											<?= !empty($schedule_data['enable_kkphim']) ? 'checked' : '' ?>> KKPhim

									</label>
									<label>

										<?php
										$schedule_data = @json_decode(@file_get_contents(CRAWL_OPHIM_PATH_SCHEDULE_JSON), true) ?: [];
										?>
										<input type="radio" class="wppd-ui-toggle" name="crawl_ophim_radio" value="nguonc"
											<?= !empty($schedule_data['enable_nguonc']) ? 'checked' : '' ?>> Nguonc
									</label>
									<label>
										<?php
										$schedule_data = @json_decode(@file_get_contents(CRAWL_OPHIM_PATH_SCHEDULE_JSON), true) ?: []; ?>
										<input type="radio" class="wppd-ui-toggle" name="crawl_ophim_radio" value="custome"
											<?= !empty($schedule_data['enable_custom']) ? 'checked' : '' ?>> Custom
									</label>

								</div>
								<div class="inside">
									<button id="save_crawl_auto" class="button">Lưu</button>
								</div>


							</div>
							<div>
								<p>
									Kích hoạt:
									<input type="checkbox" class="wppd-ui-toggle" id="crawl_ophim_schedule_enable"
										name="crawl_ophim_schedule_enable" value="ophim" <?php echo (json_decode(file_get_contents(CRAWL_OPHIM_PATH_SCHEDULE_JSON))->enable === true) ? 'checked' : ''; ?>>

								</p>
							</div>
							<div>
								<p>Trạng thái:
									<?php echo (int) get_option(CRAWL_OPHIM_OPTION_RUNNING, 0) === 1 ? "<code style='color: blue'>Đang chạy...</code>" : "<code style='color: chocolate'>Dừng</code>"; ?>
								</p>
							</div>
							<div>
								<p>Bỏ qua định dạng: <code
										style="color: red"><?php echo join(', ', $crawl_ophim_settings->filterType); ?></code></p>
								<p>Bỏ qua thể loại: <code
										style="color: red"><?php echo join(', ', $crawl_ophim_settings->filterCategory); ?></code>
								</p>
								<p>Bỏ qua quốc gia: <code
										style="color: red"><?php echo join(', ', $crawl_ophim_settings->filterCountry); ?></code>
								</p>
							</div>
							<div>
								<p>Page đầu: <code style="color: blue"><?php echo $crawl_ophim_settings->pageFrom; ?></code></p>
								<p>Page cuối: <code style="color: blue"><?php echo $crawl_ophim_settings->pageTo; ?></code></p>
							</div>

							<div class="notice notice-success">
								<p>File logs: <code style="color:brown"><?php echo $schedule_log['log_filename']; ?></code></p>
								<textarea rows="10" id="schedule_log" class=""
									readonly><?php echo $schedule_log['log_data']; ?></textarea>
							</div>

						</div>
					</div>

					<?php
					break;
				case 'ophim':
					?>
					<!-- Auto crawl phim nguồn -->
					<div class="crawl_main">
						<div class="crawl_filter notice notice-info">
							<?php
							require plugin_dir_path(__FILE__) . '/crawl_settings.php';
							?>
						</div>

						<div class="crawl_page">
							Page Crawl: From <input type="number" name="page_from" value="">
							To <input type="number" name="page_to" value="">
							<div id="get_list_movies" class="primary">Get List Movies</div>
						</div>

						<div class="crawl_page">
							Wait Timeout Random: From <input type="number" name="timeout_from" value="">(ms) -
							To <input type="number" name="timeout_to" value=""> (ms)
						</div>

						<div class="crawl_page">
							<div style="display: none" id="msg" class="notice notice-success">
								<p id="msg_text"></p>
							</div>
							<textarea rows="10" id="result_list_movies" class="list_movies"></textarea>
							<div id="roll_movies" class="roll">Trộn Link</div>
							<div id="crawl_movies" class="primary">Crawl Movies</div>

							<div style="display: none;" id="result_success" class="notice notice-success">
								<p>Crawl Thành Công</p>
								<textarea rows="10" id="list_crawl_success"></textarea>
							</div>

							<div style="display: none;" id="result_error" class="notice notice-error">
								<p>Crawl Lỗi</p>
								<textarea rows="10" id="list_crawl_error"></textarea>
							</div>
						</div>
					</div>
					<?php
					break;
				case 'custom':
					?>
					<div class="crawl_page">
						<div class="crawl_filter notice notice-info">
							<?php
							require plugin_dir_path(__FILE__) . '/crawl_settings.php';
							?>
						</div>
						<!-- <div class="postbox">
							<div class="inside">
								<textarea id="editor_crawl_source_json" style="width: 100%; height: 500px;">
									<?php
									$schedule_source = file_get_contents(MOVIE_SCHEDULE);
									$schedule_source = json_decode($schedule_source, true);
									echo htmlspecialchars(json_encode($schedule_source, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
									?>
								</textarea>
							</div>
						</div> -->
						<div class="crawl_page">
							Input File <input type="file" id="jsonUploadFile" accept=".json">
							<div id="get_list_movies_custom" class="primary">Get List Movies Custom</div>
						</div>

						<div class="crawl_page">
							Wait Timeout Random: From <input type="number" name="timeout_from" value="">(ms) -
							To <input type="number" name="timeout_to" value=""> (ms)
						</div>

						<div class="crawl_page">
							<div style="display: none" id="msg" class="notice notice-success">
								<p id="msg_text"></p>
							</div>
							<div style="display: none;" id="result_success" class="notice notice-success">
								<p>Crawl Thành Công</p>
								<textarea rows="10" id="list_crawl_success"></textarea>
							</div>

							<div style="display: none;" id="result_error" class="notice notice-error">
								<p>Crawl Lỗi</p>
								<textarea rows="10" id="list_crawl_error"></textarea>
							</div>
						</div>

					</div>
					<?php
					break;
				case 'about':
					?>
					<div class="crawl_page">
						<div class="postbox">
							<div class="inside">
								Crawl phim tool là plugin crawl phim từ 3 nguồn kkphim,nguonc,ophim.<br />
								- Hàng ngày chạy tools tầm 10 đến 20 pages đầu (tùy số lượng phim được cập nhật trong ngày) để
								update tập mới hoặc thêm phim mới!<br />
								- Hạn chế crawl nhiều page một lần để tránh lỗi không mong muốn <br />
								- Trộn link vài lần để thay đổi thứ tự crawl & update. Giúp tránh việc quá giống nhau về content của
								các website!<br />
								- API được cung cấp miễn phí: <a href="https://ophim1.cc/api-document"
									target="_blank">https://ophim1.cc/api-document</a> | <a
									href="https://phim.nguonc.com/api-document"
									target="_blank">https://phim.nguonc.com/api-document</a> | <a
									href="https://kkphim.vip/help/help.html" target="_blank">https://kkphim.vip/help/help.html</a>
								<br />
								- Mua tool hoặc có vấn đề cần giải đáp.Vui lòng liên hệ: <a href="https://t.me/roxone9"
									target="_blank">https://t.me/roxone9</a> <br />
							</div>
						</div>
					</div>
					<!-- Crawl KKPhim -->
					<?php
					break;
				case 'kkphim':
					?>
					<div class="crawl_main">
						<div class="crawl_filter notice notice-info">
							<?php
							require plugin_dir_path(__FILE__) . '/crawl_settings.php';
							?>
						</div>

						<div class="crawl_page">
							Page Crawl: From <input type="number" name="page_from" value="">
							To <input type="number" name="page_to" value="">
							<div id="get_list_movies_kkphim" class="primary">Get List Movies KKphim</div>
						</div>

						<div class="crawl_page">
							Wait Timeout Random: From <input type="number" name="timeout_from" value="">(ms) -
							To <input type="number" name="timeout_to" value=""> (ms)
						</div>

						<div class="crawl_page">
							<div style="display: none" id="msg" class="notice notice-success">
								<p id="msg_text"></p>
							</div>
							<textarea rows="10" id="result_list_movies" class="list_movies"></textarea>
							<div id="roll_movies" class="roll">Trộn Link</div>
							<div id="crawl_movies_kkphim" class="primary">Crawl Movies KKphim</div>

							<div style="display: none;" id="result_success" class="notice notice-success">
								<p>Crawl Thành Công</p>
								<textarea rows="10" id="list_crawl_success"></textarea>
							</div>

							<div style="display: none;" id="result_error" class="notice notice-error">
								<p>Crawl Lỗi</p>
								<textarea rows="10" id="list_crawl_error"></textarea>
							</div>
						</div>
					</div>
					<?php
					break;
				default:

					?>
					<div class="crawl_main">
						<div class="crawl_filter notice notice-info">
							<div class="crawl_page">
								Nhập phim cần tìm: <input type="text" name="key_search_nguonc" value="">
								<div id="search_movies_nguonc" class="primary">Search</div>
							</div>
							<?php
							require plugin_dir_path(__FILE__) . '/crawl_settings.php';
							?>
							<div class="crawl_page">
								Page Crawl: From <input type="number" name="page_from" value="">
								To <input type="number" name="page_to" value="">
							</div>
							<div class="crawl_page">
								Url Crawl: <input type="text" name="url_nguonc_crawl" size="50" value="">

								<div id="get_list_movies_nguonc" class="primary">Get List Movies Nguonc</div>
								<div>
									<p>Nhập url theo định dạng dưới đây.Chi tiết tại <a href="https://phim.nguonc.com/api-document"
											target="_blank">https://phim.nguonc.com/api-document</a></p></br>
									<code>https://phim.nguonc.com/api/films/phim-moi-cap-nhat</code></br>
									<code>https://phim.nguonc.com/api/films/danh-sach/phim-dang-chieu</code></br>
									<code>https://phim.nguonc.com/api/films/the-loai/hoat-hinh</code></br>
									<code>https://phim.nguonc.com/api/films/quoc-gia/trung-quoc</code></br>
									<code>https://phim.nguonc.com/api/films/nam-phat-hanh/2024</code>
								</div>
							</div>

							<div class="crawl_page">
								Wait Timeout Random: From <input type="number" name="timeout_from" value="">(ms) -
								To <input type="number" name="timeout_to" value=""> (ms)
							</div>

							<div class="crawl_page">
								<div style="display: none" id="msg" class="notice notice-success">
									<p id="msg_text"></p>
								</div>
								<textarea rows="10" id="result_list_movies" class="list_movies"></textarea>
								<div id="roll_movies" class="roll">Trộn Link</div>
								<div id="crawl_movies_nguonc" class="primary">Crawl Movies Nguonc</div>

								<div style="display: none;" id="result_success" class="notice notice-success">
									<p>Crawl Thành Công</p>
									<textarea rows="10" id="list_crawl_success"></textarea>
								</div>

								<div style="display: none;" id="result_error" class="notice notice-error">
									<p>Crawl Lỗi</p>
									<textarea rows="10" id="list_crawl_error"></textarea>
								</div>
							</div>
						</div>

					</div>
					<?php

					break;
			endswitch;
			?>
		</div>
	</div>

	<?php
}
