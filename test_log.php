<?php
// Test log ghi file trong WordPress Docker

function write_log($log_msg, $new_line = "\n")
{
    // Ghi log trong wp-content/crawl_ophim_logs
    $log_dir = __DIR__ . '/../../crawl_ophim_logs'; // từ plugin -> wp-content
    if (!file_exists($log_dir)) {
        mkdir($log_dir, 0777, true);
    }

    $log_file = $log_dir . '/log_' . date('d-m-Y') . '.log';

    if (!is_writable($log_dir)) {
        echo "❌ Không ghi được log, thiếu quyền trên: $log_dir\n";
        return;
    }

    $message = '[' . date("d-m-Y H:i:s") . '] ' . $log_msg . $new_line;
    file_put_contents($log_file, $message, FILE_APPEND);

    echo "✅ Đã ghi log vào: $log_file\n";
}

// --- Test thử ---
write_log("Test log schedule running...");