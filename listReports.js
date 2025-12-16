/**
 * List all reports from the reports repository
 * Updated with fallback placeholder images
 */
function listReports(param) {
    const owner = 'ModelEarth';
    const repo = 'reports';
    const branch = 'main';
    const reportsPath = '2025'; // Look in 2025 folder
    
    const apiURL = `https://api.github.com/repos/${owner}/${repo}/contents/${reportsPath}?ref=${branch}`;
    
    $.ajax({
        url: apiURL,
        method: 'GET',
        success: function(folders) {
            if (!folders || folders.length === 0) {
                $('#reportsGrid').html('<p>No reports found.</p>');
                return;
            }
            
            // Filter only directories
            const reportFolders = folders.filter(item => item.type === 'dir');
            
            if (reportFolders.length === 0) {
                $('#reportsGrid').html('<p>No report folders found.</p>');
                return;
            }
            
            // Process each report folder
            let processedCount = 0;
            
            reportFolders.forEach(folder => {
                const folderName = folder.name;
                const folderPath = folder.path;
                const reportURL = `https://model.earth/reports/${folderPath}/`;
                const githubURL = `https://github.com/${owner}/${repo}/tree/${branch}/${folderPath}`;
                
                // Fetch contents of each report folder to find preview image
                $.ajax({
                    url: folder.url,
                    method: 'GET',
                    success: function(files) {
                        processedCount++;
                        
                        // Look for preview images (PNG, JPG, JPEG)
                        const imageFiles = files.filter(file => 
                            file.type === 'file' && 
                            /\.(png|jpg|jpeg)$/i.test(file.name)
                        );
                        
                        // Find the best preview image
                        let previewImage = null;
                        
                        // Priority order for preview images
                        const preferredNames = [
                            'dashboard.png',
                            'metrics_dashboard.png',
                            'preview.png',
                            'overview.png'
                        ];
                        
                        // Check for preferred names first
                        for (let prefName of preferredNames) {
                            const found = imageFiles.find(img => 
                                img.name.toLowerCase() === prefName.toLowerCase()
                            );
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
                            const reportDisplayName = folderName
                                .replace(/-/g, ' ')
                                .replace(/\b\w/g, c => c.toUpperCase());
                            
                            previewImage = `https://via.placeholder.com/400x300/1e3a8a/ffffff?text=${encodeURIComponent(reportDisplayName)}`;
                        }
                        
                        // Look for YAML metadata (optional)
                        const yamlFile = files.find(file => 
                            file.name === 'metadata.yaml' || file.name === 'metadata.yml'
                        );
                        
                        // Create report card HTML
                        const cardHTML = `
                            <div class="report-card">
                                <div class="report-image">
                                    <img src="${previewImage}" alt="${folderName}" loading="lazy">
                                </div>
                                <div class="report-info">
                                    <h3>${folderName}</h3>
                                    ${yamlFile ? '<p class="metadata-available">📊 Metadata available</p>' : ''}
                                    <div class="report-actions">
                                        <a href="${reportURL}" target="_blank" class="btn-primary">View Report</a>
                                        <a href="${githubURL}" target="_blank" class="btn-secondary">GitHub</a>
                                    </div>
                                </div>
                            </div>
                        `;
                        
                        $('#reportsGrid').append(cardHTML);
                        
                        // If this is the last folder, we're done
                        if (processedCount === reportFolders.length) {
                            console.log(`Loaded ${reportFolders.length} reports`);
                        }
                    },
                    error: function(err) {
                        console.error(`Error loading folder ${folderName}:`, err);
                        processedCount++;
                        
                        // Still create a card even if we can't read the folder
                        const cardHTML = `
                            <div class="report-card">
                                <div class="report-image">
                                    <img src="https://via.placeholder.com/400x300/dc2626/ffffff?text=Error+Loading+Report" alt="${folderName}">
                                </div>
                                <div class="report-info">
                                    <h3>${folderName}</h3>
                                    <p style="color: #dc2626;">Unable to load report details</p>
                                    <div class="report-actions">
                                        <a href="${reportURL}" target="_blank" class="btn-primary">Try Viewing</a>
                                        <a href="${githubURL}" target="_blank" class="btn-secondary">GitHub</a>
                                    </div>
                                </div>
                            </div>
                        `;
                        
                        $('#reportsGrid').append(cardHTML);
                    }
                });
            });
        },
        error: function(err) {
            console.error('Error fetching reports:', err);
            $('#reportsGrid').html('<p style="color: #dc2626;">Error loading reports. Please try again later.</p>');
        }
    });
}
