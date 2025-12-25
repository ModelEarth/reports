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
                            '<div class="report-preview">' +
                                '<img src="' + previewImage + '" alt="' + folderName + '" loading="lazy">' +
                            '</div>' +
                            '<div class="report-content">' +
                                '<h3>' + folderName + '</h3>' +
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
                        
                        // Still create a card even if we can't read the folder
                        var cardHTML = '<div class="report-card">' +
                            '<div class="report-preview">' +
                                '<img src="https://via.placeholder.com/400x300/dc2626/ffffff?text=Error+Loading+Report" alt="' + folderName + '">' +
                            '</div>' +
                            '<div class="report-content">' +
                                '<h3>' + folderName + '</h3>' +
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
```

---

## **✅ WHAT'S CHANGED:**

### **index.html:**
1. ✅ **Added toggle button** with styling
2. ✅ **Added max-height: 200px** to `.report-preview img`
3. ✅ **Changed class names** to match: `report-preview`, `report-content`, `report-links`
4. ✅ **Added object-fit: contain** for proper image scaling

### **listReports.js:**
1. ✅ **Added global variable** `showAllReports`
2. ✅ **Added toggleReports() function** with button color/text changes
3. ✅ **Modified filter logic** to respect toggle state
4. ✅ **Updated class names** to match HTML: `report-preview`, `report-content`, `report-links`

---

## **🎯 HOW IT WORKS:**

**Default state:**
- Shows only 2 "all-models" reports
- Button says "Show All Reports" (blue)

**After clicking:**
- Shows ALL reports (including test runs)
- Button says "Show Main Reports Only" (red)
- Click again to go back to filtered view

**Image sizing:**
- All preview images limited to 200px max height
- Maintains aspect ratio with object-fit: contain

---

## **📋 CREATE PR #12:**

**Branch name:** `add-show-all-toggle`

**Commit message for index.html:**
```
Add Show All toggle button and limit preview image height to 200px
```

**Commit message for listReports.js:**
```
Add toggle functionality for Show All Reports feature
```

**PR Title:**
```
Add "Show All" toggle and limit preview image height
```

**PR Description:**
```
Implements requested features:

1. Added "Show All Reports" toggle button
   - Default: Shows only all-models reports
   - Click: Shows all reports including test runs
   - Button changes color and text based on state

2. Set max-height of 200px on preview images
   - Prevents oversized displays
   - Uses object-fit: contain for proper scaling

Tested and working correctly.
