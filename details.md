
<!--
**ML Report Visualization System \- Documentation & TO-Dos** 

**Overview** 

The ModelEarth ML report visualization system automatically displays analysis charts in a  modern, responsive grid layout. This system was implemented in November 2025 to standardize and automate ML report presentation across the RealityStream project. 
-->

**System Architecture** 

The visualization system consists of three key components: 

1\. **Template File** (**report.html**) 

• Location: 

https://github.com/ModelEarth/localsite/blob/main/start/template/report.html 

• Purpose: Universal template for all ML reports 

• Usage: Copy this file as index.html into your report folder 

2\. **JavaScript Function** ( **displayCharts()** ) 

• Location: https://github.com/ModelEarth/localsite/blob/main/js/explore.js • Purpose: Auto-detects and displays chart images 

• Features: Responsive grid, styled cards, console logging 

3\. **Chart Naming Convention** 

• Standard filenames for automatic detection 

• See "Chart Naming Standards" section below  
**Workflow** 

| 1\. Generate ML analysis → Creates charts as PNG files  2\. Save charts t• report folder → Following naming convention  3\. Copy report.html as index.html → Int• same folder  4\. Push t• GitHub Pages → Automatic visualization\! |
| :---- |

**Chart Naming Standards** 

For automatic detection and display, use these standard filenames: 

| Chart Type  | Filename  | Priority  | Description  Overall analysis summary Model performance metrics ROC curve comparisons Model confusion matrices Training duration comparison Feature importance analysis |
| ----- | ----- | ----- | ----- |
| Main Dashboard  | dashboard.png  | 1  |  |
| Metrics  | metrics\_dashboard.png  | 2  |  |
| ROC Curves  | roc\_curves.png  | 3  |  |
|  | Confusion Matrices confusion\_matrices.png 4  |  |  |
| Training Time  | training\_time.png  | 5  |  |
|  | Feature Importance feature\_importance.png 6  |  |  |

**Custom Patterns Supported:** 

• tree\_canopy\_dashboard.png 

• eye\_blinks\_roc\_curves.png 

• model\_metrics\_comparison.png 

Any PNG file in the report folder will be detected and displayed with a formatted title  derived from the filename.  
**Implementation Guide** 

**For New Reports** 

**Step 1: Generate Your Analysis** Run your Colab notebook t• create: 

• Chart PNG files 

• CSV data files 

• README.md with analysis summary 

**Step 2: Add the Template** 

| import urllib.request  \# Download template  template\_url \=   "https://raw.githubusercontent.com/ModelEarth/localsite/main/start/template/report.htm l"  template\_path \= os.path.join(report\_folder, "index.html")  urllib.request.urlretrieve(template\_url, template\_path)  print ("✅ Template downloaded as index.html") |
| :---- |

**Step 3: Push t• GitHub** 

| \# Your existing GitHub push code  \# The index.html will be included automatically |
| :---- |

**Step 4: Enable GitHub Pages** 

• G• t• rep• Settings → Pages 

• Select source: ***main*** branch 

• Your report will be live at: https://\[username\].github.io/reports/\[folder\]/  
**For Existing Reports** 

**Option A: Update via GitHub Web Interface** 

1\. Navigate t• your report folder 

2\. Click ***"Add file" → "Create new file"*** 

3\. Name it ***index.html*** 

4\. Copy content from:  

https://raw.githubusercontent.com/ModelEarth/localsite/main/start/template/repor t.html 

5\. Commit changes 

**Option B: Update via Git** 

| cd reports/2025/your-report-folder/  curl  https://raw.githubusercontent.com/ModelEarth/localsite/main/start/template/report.html  \-• index.html  git add index.html  git commit \-m "Add displayCharts template"  git push |
| :---- |

**Technical Details** 

**displayCharts() Function**

The function automatically: 

1\. Detects current folder path from URL 

2\. Calls GitHub API t• list all files in folder 

3\. Filters for PNG images 

4\. Categorizes charts by filename patterns 

5\. Displays in responsive grid with styled cards 

6\. Shows CSV tables below charts  
**Console Logging** 

Debug messages help troubleshoot issues: 

| \[displayCharts\] Starting with params: {owner, repo, branch}  \[displayCharts\] Current folder: 2025/tree-canopy-all-models-2025-11-12 \[displayCharts\] Found chart: tree\_canopy\_dashboard.png  \[displayCharts\] Total PNG files found: 2  \[displayCharts\] Successfully displayed 2 charts |
| :---- |

**Styling Features** 

• **Responsive Grid**: 2 columns on desktop, 1 on mobile 

• **Card Design**: White background, rounded corners, subtle shadow 

• **Hover Effects**: Elevates on hover with enhanced shadow 

• **Dark Mode**: Automatically adapts t• dark theme 

• **Mobile Optimized**: Single column layout on small screens 


## TO-D0 List for Team

**HIGH PRIORITY** 

**1\. Update Existing Reports** (Assigned: Akhila) 

• \[x\] Tree Canopy report 

• \[x\] Eye Blinks report 

• \[ \] Document other reports needing updates 

• \[ \] Create script for batch updates 

**2\. Automate Colab Integration** (Assigned: Akhila) 

• \[ \] Add template download code t• existing notebooks 

• \[ \] Test with new MOF analysis 

• \[ \] Document in notebook comments  

**3\. Test with MOF Reports** (Assigned: Varun) 

• \[ \] Apply template t• MOF water capture analysis • \[ \] Verify chart detection works 

• \[ \] Report any issues or needed enhancements **4\. Document on RealityStream** (Assigned: Akhila) 

• \[ \] Add this guide t• https://model.earth/realitystream • \[ \] Create visual examples 

• \[ \] Link t• live demonstrations 

**MEDIUM PRIORITY** 

**5\. Enhance Dark Mode Support** 

• \[ \] Test dark mode across different reports 

• \[ \] Adjust chart card colors for better contrast • \[ \] Add dark mode toggle if needed 

**6\. Add Chart Filtering** 

• \[ \] Filter by chart type (metrics, ROC, confusion, etc.) • \[ \] Search functionality for chart titles 

• \[ \] Category tags for organizational purposes **7\. Download Functionality** 

• \[ \] Add "Download All Charts" button 

• \[ \] Individual chart download buttons 

• \[ \] Export charts as ZIP file 

**8\. Mobile Optimization** 

• \[ \] Test on various mobile devices 

• \[ \] Optimize touch interactions 

• \[ \] Improve mobile layout spacing

**9\. Add Chart Metadata** 

• \[ \] Support for chart descriptions from JSON • \[ \] Display model accuracies from metadata • \[ \] Link t• detailed analysis sections  
**10\. Comparison View** 

• \[ \] Side-by-side chart comparison mode • \[ \] Sync scrolling for multiple reports • \[ \] Highlight differences feature 

**LOW PRIORITY** 

**11\. Interactive Features** 

• \[ \] Zoom/fullscreen view for individual charts • \[ \] Lightbox gallery mode 

• \[ \] Chart rotation/slideshow 

**12\. Export Options** 

• \[ \] Generate PDF report from web page • \[ \] Export as PowerPoint slides 

• \[ \] Create shareable links with annotations **13\. AI-Powered Summaries** 

• \[ \] Auto-generate insights from charts • \[ \] Compare against historical reports • \[ \] Suggest optimization opportunities 

**14\. Collaboration Features** 

• \[ \] Add comments t• specific charts • \[ \] Share annotations with team 

• \[ \] Version comparison tool 

**15\. Analytics Integration** 

• \[ \] Track which charts are viewed most • \[ \] Time spent on different sections 

• \[ \] User engagement metrics  



**Communication** 

**GitHub Issues**: https://github.com/modelearth/projects/issues/63

**Documentation**: https://model.earth/realitystream  
**Troubleshooting** 

**Charts Not Displaying** 

**Check Console** (F12 → Console tab): 

• Look for **\[displayCharts\]** messages 

• Check for errors in red 

**Common Issues:** 

1\. **Function not found**: Clear browser cache, hard refresh (Ctrl+Shift+R) 2\. **No charts detected**: Verify PNG files are in same folder as index.html 3\. **Wrong folder detected**: Check URL path matches folder structure 

**Template Not Working** 

1\. **Verify template content**: Should be \~44 lines, includes **displayCharts(param)** 2\. **Check file location**: Must be named **index.html** in report folder 

3\. **Wait for GitHub Pages**: Takes 2-5 minutes t• rebuild after commit 

**GitHub Pages 404 Error** 

1\. **Enable GitHub Pages**: Settings → Pages → Select **main** branch 

2\. **Check folder structure**: Must be **/reports/YYYY/folder-name/** 

3\. **Verify index.html exists**: Should be in the report folder 

**Resources** 

**Links** 

• **Main Repo**: https://github.com/ModelEarth/localsite 

• **Template**:  

https://github.com/ModelEarth/localsite/blob/main/start/template/report.html • **Function**: https://github.com/ModelEarth/localsite/blob/main/js/explore.js • **Pull Request**: https://github.com/ModelEarth/localsite/pull/58 

• **Live Examples**:  

• Tree Canopy: https://akhilaguska27.github.io/reports/2025/tree-canopy-all models-2025-11-12/ 

• Eye Blinks: https://akhilaguska27.github.io/reports/2025/eye-blinks-all-models 2025-11-06/  
**Code Snippets** 

**Python \- Download Template**: 

| import urllib.request  import os  template\_url \=   "https://raw.githubusercontent.com/ModelEarth/localsite/main/start/template/report.htm l"  template\_path \= os.path.join(report\_folder, "index.html")  try:   urllib.request.urlretrieve(template\_url, template\_path)   print ("✅ Template downloaded as index.html")  except Exception as e:   print (f"⚠️ Could not download template: {e}") |
| :---- |



**Version History** 

**v1.0 \- November 26, 2025** 

• Initial release of displayCharts() function 

• Created universal report.html template 

• Implemented automatic chart detection 

• Added responsive grid layout 

• Merged PR \#58 int• ModelEarth/localsite  
**Future Enhancements** 

**Planned Features** 

1\. **Vide• Tutorial Series** 

• How t• use the template 

• Customization guide 

• Troubleshooting common issues 

2\. **Interactive Dashboard Builder** 

• Drag-and-drop chart arrangement 

• Custom layout options 

• Save layout preferences 

3\. **Report Comparison Tool** 

• Compare multiple reports side-by-side 

• Highlight performance differences 

• Track improvements over time 

4\. **Automated Testing** 

• CI/CD integration 

• Screenshot comparisons 

• Performance benchmarks 

**Contact & Support** 


**Want to Contribute?** 

• Fork the localsite rep• 

• Make your improvements 

• Submit a pull request 

• Follow the code style in PR \#58 

*Last Updated: November 28, 2025 Maintained by: ModelEarth RealityStream Team*