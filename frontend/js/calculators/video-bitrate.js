// Video Bitrate Calculator
(function () {
    'use strict';

    // DOM Elements
    const videoDuration = document.getElementById('videoDuration');
    const videoBitrate = document.getElementById('videoBitrate');
    const audioBitrate = document.getElementById('audioBitrate');
    const calculateBtn = document.getElementById('calculateBtn');
    const resultsSection = document.getElementById('resultsSection');
    const totalSize = document.getElementById('totalSize');
    const videoSize = document.getElementById('videoSize');
    const audioSize = document.getElementById('audioSize');
    const totalBitrate = document.getElementById('totalBitrate');
    const recalculateBtn = document.getElementById('recalculateBtn');
    const errorMessage = document.getElementById('errorMessage');
    const errorText = document.getElementById('errorText');

    // Event Listeners
    if (calculateBtn) {
        calculateBtn.addEventListener('click', calculate);
    }

    if (recalculateBtn) {
        recalculateBtn.addEventListener('click', resetCalculator);
    }

    // Calculate
    function calculate() {
        const _trackStartTime = Date.now();

        hideError();

        try {
            const duration = parseFloat(videoDuration.value);
            const vBitrate = parseFloat(videoBitrate.value);
            const aBitrate = parseFloat(audioBitrate.value);

            // Validation
            if (isNaN(duration) || isNaN(vBitrate)) {
                throw new Error('Please enter duration and video bitrate');
            }

            if (duration <= 0 || vBitrate <= 0) {
                throw new Error('Duration and bitrate must be positive');
            }

            const audioBitrateValue = isNaN(aBitrate) || aBitrate < 0 ? 0 : aBitrate;

            // Convert duration to seconds
            const durationSeconds = duration * 60;

            // Calculate sizes
            // Video: (bitrate in Mbps × duration in seconds × 1000000) / 8 / 1024 / 1024
            const videoSizeMB = (vBitrate * durationSeconds * 1000000) / 8 / 1024 / 1024;

            // Audio: (bitrate in kbps × duration in seconds × 1000) / 8 / 1024 / 1024
            const audioSizeMB = (audioBitrateValue * durationSeconds * 1000) / 8 / 1024 / 1024;

            const totalSizeMB = videoSizeMB + audioSizeMB;

            // Calculate total bitrate
            const totalBitrateMbps = vBitrate + (audioBitrateValue / 1000);

            // Display results
            totalSize.textContent = formatSize(totalSizeMB);
            videoSize.textContent = formatSize(videoSizeMB);
            audioSize.textContent = formatSize(audioSizeMB);
            totalBitrate.textContent = `${totalBitrateMbps.toFixed(2)} Mbps`;

            resultsSection.style.display = 'block';

        } catch (error) {
            showError(error.message);
        }
    }

    // Format file size
    function formatSize(sizeMB) {
        if (sizeMB < 1) {
            return `${(sizeMB * 1024).toFixed(2)} KB`;
        } else if (sizeMB < 1024) {
            return `${sizeMB.toFixed(2)} MB`;
        } else {
            return `${(sizeMB / 1024).toFixed(2)} GB`;
        }
    }

    // Show error
    function showError(message) {
        errorText.textContent = message;
        errorMessage.style.display = 'flex';
    }

    // Hide error
    function hideError() {
        errorMessage.style.display = 'none';
    }

    // Reset calculator
    function resetCalculator() {
        videoDuration.value = '';
        videoBitrate.value = '';
        audioBitrate.value = '';
        hideError();
        resultsSection.style.display = 'none';
    }
})();
