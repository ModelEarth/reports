// Auto-generate list of ML reports from GitHub
function listReports() {
    const owner = 'ModelEarth';
    const repo = 'reports';
    const branch = 'main';
    const year = '2025';
    
    console.log('[listReports] Fetching reports...');
    $('#loadingMessage').show();
    
    $.ajax({
        url: `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`,
        method: 'GET',
        success: function(data) {
            $('#loadingMessage').hide();
            
            const reportFolders = data.tree.filter(item => {
                return item.type === 'tree' && 
                       item.path.startsWith(`${year}/`) &&
                       item.path.split('/').length === 2;
            });
            
            console.log('[listReports] Found', reportFolders.length, 'reports');
            
            if (reportFolders.length === 0) {
                $('#reportsList').html('<p>No reports found yet.</p>');
                return;
            }
            
            reportFolders.sort((a, b) => b.path.localeCompare(a.path));
            reportFolders.forEach(folder => displayReport(folder.path, owner, repo, branch));
        },
        error: function(err) {
            $('#loadingMessage').hide();
            console.error('[listReports] Error:', err);
            $('#reportsList').html('<p style="color:red;">Error loading reports.</p>');
        }
    });
}

function displayReport(folderPath, owner, repo, branch) {
    $.ajax({
        url: `https://api.github.com/repos/${owner}/${repo}/contents/${folderPath}?ref=${branch}`,
        method: 'GET',
        success: function(files) {
            const folderName = folderPath.split('/')[1];
            const reportUrl = `https://${owner.toLowerCase()}.github.io/${repo}/${folderPath}/`;
            
            const yamlFile = files.find(f => f.name.endsWith('.yaml') || f.name.endsWith('.yml'));
            const dashboardImg = files.find(f => /dashboard\.png$/i.test(f.name));
            const previewImg = dashboardImg || files.find(f => f.name.endsWith('.png'));
            
            let reportDate = 'Recent';
            let reportTitle = folderName.replace(/_/g, ' ').replace(/-/g, ' ');
            
            const dateMatch = folderName.match(/(\d{4})-(\d{2})-(\d{2})/);
            if (dateMatch) {
                const [, year, month, day] = dateMatch;
                reportDate = new Date(`${year}-${month}-${day}`).toLocaleDateString('en-US', {
                    year: 'numeric', month: 'long', day: 'numeric'
                });
            }
            
            if (yamlFile) {
                $.ajax({
                    url: yamlFile.download_url,
                    method: 'GET',
                    dataType: 'text',
                    success: function(yamlContent) {
                        const metadata = parseYAML(yamlContent);
                        if (metadata.title) reportTitle = metadata.title;
                        if (metadata.date) reportDate = metadata.date;
                        renderCard(folderPath, reportUrl, previewImg, reportDate, reportTitle, metadata);
                    },
                    error: function() {
                        renderCard(folderPath, reportUrl, previewImg, reportDate, reportTitle, null);
                    }
                });
            } else {
                renderCard(folderPath, reportUrl, previewImg, reportDate, reportTitle, null);
            }
        }
    });
}

function parseYAML(yamlText) {
    const metadata = {};
    yamlText.split('\n').forEach(line => {
        const match = line.match(/^([^:#]+):\s*(.+)$/);
        if (match) {
            metadata[match[1].trim()] = match[2].trim().replace(/['"]/g, '');
        }
    });
    return metadata;
}

function renderCard(folderPath, reportUrl, previewImg, reportDate, reportTitle, metadata) {
    let previewHTML = '';
    if (previewImg) {
        const imgUrl = `https://raw.githubusercontent.com/ModelEarth/reports/main/${folderPath}/${previewImg.name}`;
        previewHTML = `<div class="report-preview"><img src="${imgUrl}" alt="${reportTitle}" loading="lazy"></div>`;
    }
    
    let metaHTML = '';
    if (metadata) {
        if (metadata.models) metaHTML += `<div class="report-models">Models: ${metadata.models}</div>`;
        if (metadata.best_accuracy) metaHTML += `<div class="report-accuracy">Best: ${metadata.best_accuracy}</div>`;
        if (metadata.analyst) metaHTML += `<div class="report-analyst">By: ${metadata.analyst}</div>`;
    }
    
    const cardHTML = `
        <div class="report-card">
            ${previewHTML}
            <div class="report-content">
                <h3><a href="${reportUrl}" target="_blank">${reportTitle}</a></h3>
                <div class="report-date">📅 ${reportDate}</div>
                ${metaHTML}
                <div class="report-links">
                    <a href="${reportUrl}" class="btn-primary" target="_blank">View Report</a>
                    <a href="https://github.com/ModelEarth/reports/tree/main/${folderPath}" class="btn-secondary" target="_blank">GitHub</a>
                </div>
            </div>
        </div>
    `;
    
    $('#reportsList').append(cardHTML);
}

$(document).ready(function() { listReports(); });
