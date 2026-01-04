// Global variable to track filter state
var showAllReports = false;

// Toggle function to show/hide all reports
function toggleReports() {
    showAllReports = !showAllReports;
    var button = document.getElementById('toggleFilter');
    
    if (showAllReports) {
        button.textContent = 'Show Main Reports Only';
        button.style.backgroundColor = '#dc2626'; // Red when showing all
    } else {
        button.textContent = 'Show All Reports';
        button.style.backgroundColor = '#1e3a8a'; // Blue when filtered
    }
    
    // Clear and reload reports
    $('#loadingMessage').show();
    $('#reportsList').html('');
    listReports({});
}

/**
 * List all reports from the reports repository
 * Updated with fallback placeholder images and toggle functionality
 */
function listReports(param) {
    var owner = 'ModelEarth';
    var repo = 'reports';
    var branch = 'main';
    var reportsPath = '2025'; // Look in 2025 folder
    
    var apiURL = 'https://api.github.com/repos/' + owner + '/' + repo + '/contents/' + reportsPath + '?ref=' + branch;
    
    $.ajax({
        url: apiURL,
        method: 'GET',
        success: function(folders) {
            if (!folders || folders.length === 0) {
                $('#loadingMessage').hide();
                $('#reportsList').html('<p>No reports found.</p>');
                return;
            }
            
            // Filter directories based on toggle state
            var reportFolders = folders.filter(function(item) {
                if (showAllReports) {
                    // Show all directories
                    return item.type === 'dir';
                } else {
                    // Show only "all-models" directories
                    return item.type === 'dir' && item.name.indexOf('all-models') !== -1;
                }
            });
            
            if (reportFolders.length === 0) {
                $('#loadingMessage').hide();
                $('#reportsList').html('<p>No report folders found.</p>');
                return;
            }
            
            // Process each report folder
            var processedCount = 0;
            
            reportFolders.forEach(function(folder) {
                var folderName = folder.name;
                var folderPath = folder.path;
                var reportURL = 'https://model.earth/reports/' + folderPath + '/';
                var githubURL = 'https://github.com/' + owner + '/' + repo + '/tree/' + branch + '/' + folderPath;
                
                // Fetch contents of each report folder to find preview image
                $.ajax({
                    url: folder.url,
                    method: 'GET',
                    success: function(files) {
                        processedCount++;
                        
                        // Look for preview images (PNG, JPG, JPEG)
                        var imageFiles = files.filter(function(file) {
                            return file.type === 'file' && /\.(png|jpg|jpeg)$/i.test(file.name);
                        });
                        
                        // Find the best preview image
                        var previewImage = null;
                        
                        // Priority order for preview images
                        var preferredNames = [
                            'dashboard.png',
                            'metrics_dashboard.png',
                            'preview.png',
                            'overview.png'
                        ];
                        
                        // Check for preferred names first
                        for (var i = 0; i < preferredNames.length; i++) {
                            var prefName = preferredNames[i];
                            var found = imageFiles.find(function(img) {
                                return img.name.toLowerCase() === prefName.toLowerCase();
                            });
                            if (found) {
                                previewImage = found.download_url;
                                break;
                            }
                        }
                        
                        // If no preferred image, use first PNG/JPG found
                        if (!previewImage && imageFiles.length > 0) {
                            previewImage = imageFiles[0].download_url;
                        }
                        
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
                        var yamlFile = files.find(function(file) {
                            return file.name === 'metadata.yaml' || file.name === 'metadata.yml';
                        });
                        
                        // Escape folder name for safe HTML insertion
                        var safeFolderName = folderName.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
                        
                        // Create report card HTML
                        var cardHTML = '<div class="report-card">' +
                            '<div class="report-preview">' +
                                '<img src="' + previewImage + '" alt="Report preview" loading="lazy">' +
                            '</div>' +
                            '<div class="report-content">' +
                                '<h3>' + safeFolderName + '</h3>' +
                                (yamlFile ? '<p class="metadata-available">📊 Metadata available</p>' : '') +
                                '<div class="report-links">' +
                                    '<a href="' + reportURL + '" target="_blank" class="btn-primary">View Report</a>' +
                                    '<a href="' + githubURL + '" target="_blank" class="btn-secondary">GitHub</a>' +
                                '</div>' +
                            '</div>' +
                        '</div>';
                        
                        $('#reportsList').append(cardHTML);
                        
                        // If this is the last folder, hide loading message
                        if (processedCount === reportFolders.length) {
                            $('#loadingMessage').hide();
                            console.log('Loaded ' + reportFolders.length + ' reports');
                        }
                    },
                    error: function(err) {
                        console.error('Error loading folder ' + folderName + ':', err);
                        processedCount++;
                        
                        // Escape folder name for safe HTML insertion
                        var safeFolderName = folderName.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
                        
                        // Create inline SVG error placeholder
                        var errorPlaceholder = 'data:image/svg+xml,' + encodeURIComponent(
                            '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300">' +
                            '<rect width="400" height="300" fill="#dc2626"/>' +
                            '<text x="200" y="140" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="18" font-weight="bold">Error</text>' +
                            '<text x="200" y="170" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="12">Unable to Load Report</text>' +
                            '</svg>'
                        );
                        
                        // Still create a card even if we can't read the folder
                        var cardHTML = '<div class="report-card">' +
                            '<div class="report-preview">' +
                                '<img src="' + errorPlaceholder + '" alt="Error loading report">' +
                            '</div>' +
                            '<div class="report-content">' +
                                '<h3>' + safeFolderName + '</h3>' +
                                '<p style="color: #dc2626;">Unable to load report details</p>' +
                                '<div class="report-links">' +
                                    '<a href="' + reportURL + '" target="_blank" class="btn-primary">Try Viewing</a>' +
                                    '<a href="' + githubURL + '" target="_blank" class="btn-secondary">GitHub</a>' +
                                '</div>' +
                            '</div>' +
                        '</div>';
                        
                        $('#reportsList').append(cardHTML);
                        
                        // If this is the last folder, hide loading message
                        if (processedCount === reportFolders.length) {
                            $('#loadingMessage').hide();
                        }
                    }
                });
            });
        },
        error: function(err) {
            console.error('Error fetching reports:', err);
            $('#loadingMessage').hide();
            $('#reportsList').html('<p style="color: #dc2626;">Error loading reports. Please try again later.</p>');
        }
    });
}
