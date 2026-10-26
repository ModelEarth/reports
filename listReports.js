// Global variable to track filter state
var showAllReports = false;

// Main reports are the ones with charts. Show All Reports also shows those without (class report-no-charts),
// by toggling show-all on #reportsList, without fetching the list again.
function toggleReports() {
    showAllReports = !showAllReports;
    $('#reportsList').toggleClass('show-all', showAllReports);
    updateToggle();
}

// The button's label and color, and the button only when some reports have no charts
function updateToggle() {
    var button = document.getElementById('toggleFilter');
    if (!button) return;
    var hidden = $('#reportsList .report-no-charts').length;
    $(button).closest('.toggle-container').toggle(hidden > 0);
    if (showAllReports) {
        button.textContent = 'Show Main Reports Only';
        button.style.backgroundColor = '#dc2626'; // Red when showing all
    } else {
        button.textContent = 'Show All Reports (' + hidden + ' without charts)';
        button.style.backgroundColor = '#1e3a8a'; // Blue when filtered
    }
}

// The repo's file list is kept this long in the browser, since GitHub allows 60 API requests an hour per address
var REPORTS_CACHE_MINUTES = 10;

/**
 * List the reports in the reports repository: each {year}/{folder}/ except "verification".
 * One GitHub API request (the repo's recursive tree) gives every folder and its files.
 */
function listReports(param) {
    var owner = 'ModelEarth';
    var repo = 'reports';
    var branch = 'main';
    var treeURL = 'https://api.github.com/repos/' + owner + '/' + repo + '/git/trees/' + branch + '?recursive=1';
    var cacheKey = 'reportsTree:' + treeURL;
    var isLocalhost = location.hostname === 'localhost' || location.hostname === '127.0.0.1';

    var cached = null;
    try {
        cached = JSON.parse(sessionStorage.getItem(cacheKey) || 'null');
    } catch (e) {}
    if (cached && Date.now() - cached.saved < REPORTS_CACHE_MINUTES * 60000) {
        renderReports(cached.paths);
        return;
    }

    $.ajax({
        url: treeURL,
        method: 'GET',
        success: function(data) {
            var paths = (data.tree || []).filter(function(item) {
                return item.type === 'blob';
            }).map(function(item) {
                return item.path;
            });
            try {
                sessionStorage.setItem(cacheKey, JSON.stringify({ saved: Date.now(), paths: paths }));
            } catch (e) {}
            renderReports(paths);
        },
        error: function(xhr) {
            console.error('Error fetching reports:', xhr.status, xhr.responseText);
            $('#loadingMessage').hide();
            var detail = (xhr.responseJSON && xhr.responseJSON.message) || xhr.statusText || 'no response';
            var message = 'Error loading reports from GitHub (HTTP ' + (xhr.status || 'none') + ': ' + $('<span>').text(detail).html()
                + '). Please try again later.';
            var reset = Number(xhr.getResponseHeader && xhr.getResponseHeader('X-RateLimit-Reset'));
            if ((xhr.status === 403 || xhr.status === 429) && reset) {
                message = 'GitHub\'s API limit was reached (HTTP ' + xhr.status + '). Without a token, GitHub allows 60 API requests '
                    + 'an hour from each address, shared by every page and tool on your network. '
                    + 'This page uses one request per load and reuses its list for ' + REPORTS_CACHE_MINUTES + ' minutes. '
                    + 'Reports will list again after '
                    + new Date(reset * 1000).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) + '.';
            }
            if (isLocalhost) {
                message += ' (' + treeURL + ')';
            }
            $('#reportsList').html('<p style="color: #dc2626;">' + message + '</p>');
        }
    });

    // Group the repo's files into report folders, most recent first, and draw a card for each
    function renderReports(paths) {
        var folders = {};
        paths.forEach(function(path) {
            var match = path.match(/^(\d{4})\/([^\/]+)\/(.+)$/);
            if (!match || match[2] === 'verification') return;
            var folderPath = match[1] + '/' + match[2];
            (folders[folderPath] = folders[folderPath] || { name: match[2], path: folderPath, files: [] }).files.push(match[3]);
        });
        var reportFolders = Object.keys(folders).map(function(key) {
            return folders[key];
        });
        // By the date ending each folder's name (eye-blinks-2026-10-26T09-15-00), newest first
        var sortKey = function(folder) {
            var date = folder.name.match(/\d{4}-\d\d-\d\d(T\d\d-\d\d-\d\d)?$/);
            return (date ? date[0] : folder.path.slice(0, 4)) + ' ' + folder.name;
        };
        reportFolders.sort(function(a, b) {
            return sortKey(b).localeCompare(sortKey(a));
        });

        $('#loadingMessage').hide();
        if (reportFolders.length === 0) {
            $('#reportsList').html('<p>No report folders found.' + (isLocalhost ? ' (' + treeURL + ')' : '') + '</p>');
            return;
        }
        $('#reportsList').html(reportFolders.map(reportCard).join(''));
        updateToggle();
        console.log('Loaded ' + reportFolders.length + ' reports');
    }

    function reportCard(folder) {
        var folderName = folder.name;
        var folderPath = folder.path;
        var reportURL = folderPath + '/'; // Relative to reports/index.html, so localhost links stay local
        var githubURL = 'https://github.com/' + owner + '/' + repo + '/tree/' + branch + '/' + folderPath;
        var rawURL = 'https://raw.githubusercontent.com/' + owner + '/' + repo + '/' + branch + '/' + folderPath + '/';

        // Preview images (PNG, JPG, JPEG) in the folder itself
        var imageFiles = folder.files.filter(function(name) {
            return name.indexOf('/') < 0 && /\.(png|jpg|jpeg)$/i.test(name);
        });

        // Priority order for preview images, else the first image found
        var preferredNames = [
            'dashboard.png',
            'metrics_dashboard.png',
            'preview.png',
            'overview.png'
        ];
        var previewName = null;
        for (var i = 0; i < preferredNames.length && !previewName; i++) {
            previewName = imageFiles.find(function(name) {
                return name.toLowerCase() === preferredNames[i];
            }) || null;
        }
        previewName = previewName || imageFiles[0];
        var previewImage = previewName ? rawURL + previewName : null;

        // FALLBACK: Use inline SVG placeholder if no image found
        if (!previewImage) {
            // Create a nice placeholder with the report name
            var reportDisplayName = folderName
                .replace(/-/g, ' ')
                .replace(/\b\w/g, function(c) { return c.toUpperCase(); });

            // Create inline SVG placeholder (always works, no external dependencies)
            var svgText = reportDisplayName.length > 30 ? reportDisplayName.substring(0, 27) + '...' : reportDisplayName;
            previewImage = 'data:image/svg+xml,' + encodeURIComponent(
                '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300">' +
                '<rect width="400" height="300" fill="#1e3a8a"/>' +
                '<text x="200" y="140" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="18" font-weight="bold">ML Report</text>' +
                '<text x="200" y="170" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="12">' + svgText + '</text>' +
                '</svg>'
            );
        }

        // Look for YAML metadata (optional)
        var hasMetadata = folder.files.indexOf('metadata.yaml') >= 0 || folder.files.indexOf('metadata.yml') >= 0;

        // Escape folder name for safe HTML insertion
        var safeFolderName = folderName.replace(/"/g, '&quot;').replace(/'/g, '&#39;');

        // Reports without charts show only with Show All Reports
        return '<div class="report-card' + (imageFiles.length ? '' : ' report-no-charts') + '">' +
            '<div class="report-preview">' +
                '<a href="' + reportURL + '"><img src="' + previewImage + '" alt="Report preview" loading="lazy"></a>' +
            '</div>' +
            '<div class="report-content">' +
                '<h3>' + safeFolderName + '</h3>' +
                (hasMetadata ? '<p class="metadata-available">📊 Metadata available</p>' : '') +
                '<div class="report-links">' +
                    '<a href="' + reportURL + '" class="btn-primary">View Report</a>' +
                    '<a href="' + githubURL + '" target="_blank" class="btn-secondary">GitHub</a>' +
                '</div>' +
            '</div>' +
        '</div>';
    }
}
