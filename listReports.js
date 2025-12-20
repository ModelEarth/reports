/**
 * List all reports from the reports repository
 * Updated with fallback placeholder images
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
                $('#reportsList').html('<p>No reports found.</p>');
                return;
            }
            
            // Filter only directories
            var reportFolders = folders.filter(function(item) {
                return item.type === 'dir';
            });
            
            if (reportFolders.length === 0) {
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
                        
                        // FALLBACK: Use placeholder if no image found
                        if (!previewImage) {
                            // Create a nice placeholder with the report name
                            var reportDisplayName = folderName
                                .replace(/-/g, ' ')
                                .replace(/\b\w/g, function(c) { return c.toUpperCase(); });
                            
                            previewImage = 'https://via.placeholder.com/400x300/1e3a8a/ffffff?text=' + encodeURIComponent(reportDisplayName);
                        }
                        
                        // Look for YAML metadata (optional)
                        var yamlFile = files.find(function(file) {
                            return file.name === 'metadata.yaml' || file.name === 'metadata.yml';
                        });
                        
                        // Create report card HTML
                        var cardHTML = '<div class="report-card">' +
                            '<div class="report-image">' +
                                '<img src="' + previewImage + '" alt="' + folderName + '" loading="lazy">' +
                            '</div>' +
                            '<div class="report-info">' +
                                '<h3>' + folderName + '</h3>' +
                                (yamlFile ? '<p class="metadata-available">📊 Metadata available</p>' : '') +
                                '<div class="report-actions">' +
                                    '<a href="' + reportURL + '" target="_blank" class="btn-primary">View Report</a>' +
                                    '<a href="' + githubURL + '" target="_blank" class="btn-secondary">GitHub</a>' +
                                '</div>' +
                            '</div>' +
                        '</div>';
                        
                        $('#reportsList').append(cardHTML);
                        
                        // If this is the last folder, we're done
                        if (processedCount === reportFolders.length) {
                            console.log('Loaded ' + reportFolders.length + ' reports');
                        }
                    },
                    error: function(err) {
                        console.error('Error loading folder ' + folderName + ':', err);
                        processedCount++;
                        
                        // Still create a card even if we can't read the folder
                        var cardHTML = '<div class="report-card">' +
                            '<div class="report-image">' +
                                '<img src="https://via.placeholder.com/400x300/dc2626/ffffff?text=Error+Loading+Report" alt="' + folderName + '">' +
                            '</div>' +
                            '<div class="report-info">' +
                                '<h3>' + folderName + '</h3>' +
                                '<p style="color: #dc2626;">Unable to load report details</p>' +
                                '<div class="report-actions">' +
                                    '<a href="' + reportURL + '" target="_blank" class="btn-primary">Try Viewing</a>' +
                                    '<a href="' + githubURL + '" target="_blank" class="btn-secondary">GitHub</a>' +
                                '</div>' +
                            '</div>' +
                        '</div>';
                        
                        $('#reportsList').append(cardHTML);
                    }
                });
            });
        },
        error: function(err) {
            console.error('Error fetching reports:', err);
            $('#reportsList').html('<p style="color: #dc2626;">Error loading reports. Please try again later.</p>');
        }
    });
}
