/* eslint-disable import/no-extraneous-dependencies */
import { AxePuppeteer } from 'axe-puppeteer';
import puppeteer from  'puppeteer';
import { execSync, spawn } from 'child_process';
import fs from 'fs';

const PORT = 8080
let report = '';

async function buildAndServe() {
  console.info('Building the project...');
  try {
    // Execute the build command (e.g., yarn build)
    execSync('yarn build', { stdio: 'inherit' });
    console.info('Build successful.');
  } catch (error) {
    console.error(error)
    report = 'Build failed.';
    console.error('Build failed.');
    process.exitCode = 1; // Set exit code to indicate failure
    return;
  }

  console.info('Previewing the project...');
  // Execute the preview command (e.g., yarn preview)
  const serveProcess = spawn('yarn', ['preview'], {shell: true});

   // Capture the output of the preview process
   let serveOutput = '';
   serveProcess.stdout.on('data', (data) => {
     serveOutput += data.toString();
   });

   let serveErrorOutput = ''
   serveProcess.stderr.on('data', (data) => {
    serveErrorOutput += data.toString();
  });
  


  // Wait for a brief moment to ensure the server is up and running
  await new Promise(resolve => setTimeout(resolve, 2000));
  const serveExitCode =  serveProcess.exitCode

    console.log({ serveExitCode })

    if(serveExitCode){
      console.error(`Error: yarn preview process exited with code ${serveExitCode}`);
      if(serveOutput){
        console.debug(`Serve process output:\n${serveOutput}`);
      }
  
      if(serveErrorOutput){
        console.error(`Serve process error:\n${serveErrorOutput}`);
      }
      process.exitCode = serveExitCode; // Set exit code to indicate failure
      return;
    } else {
      console.debug("Preview done!")
    }

    if(serveOutput){
      console.debug(`Serve process output:\n${serveOutput}`);
    }

    if(serveErrorOutput){
      console.error(`Serve process error:\n${serveErrorOutput}`);
    }

  // Run the accessibility check
  await runAccessibilityCheck();

  // Kill the preview process after the accessibility check
  serveProcess.kill();
}

async function runAccessibilityCheck() {
  console.debug("Lauching webpage")
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  const localhostUrl = `http://localhost:${PORT}`;
  console.debug("Opening webpage")
  await page.goto(localhostUrl);

  console.debug("Analyzing webpage!")
  const results = await new AxePuppeteer(page).analyze();
  await browser.close();

  const { violations } = results;

  report = '## Accessibility Violations Check 🔎\n\n';

  if (violations.length === 0) {
    console.info('No accessibility violations found.');
    report += '### ✅ No accessibility violations found.\n\n';
  } else {
    console.info('Accessibility violations found:');
    report += '### ⏳ Accessibility violations found.\n\n';
    for (const violation of violations) {
      report += `#### ${violation.description}\n\n`;

      if (violation.impact === 'critical') {
        report +=
          '\n\n##### ❌ Critical accessibility violations found.\n\nSee comments below.\n\n';
        console.error('Critical accessibility violations found.');
        process.exitCode = 1; // Set exit code to indicate failure
      } else {
        report += '\n\n##### ✅ No critical accessibility violations found.\n\n';
      }

      report += `[${violation.help}](${violation.helpUrl})\n\n`;
      report += `- Impact: **${violation.impact}**\n\n`;
      report += `- Tags: ${violation.tags.map((tag) => `\`${tag}\``).join(', ')}\n\n`;
      let nodes = '';
      for (const node of violation.nodes) {
        nodes += `   1. **Node:** \`${node.html}\`, **Impact:** ${
          node.impact
        }\n\n       ${node.failureSummary.split('\n  ').join('\n\n      - ')}\n\n`;
      }
      report += `<details><summary>Click here for detailed report</summary>\n\n`;
      report += nodes;
      report += '</details>\n\n';
    }
  }
}

await buildAndServe();

fs.writeFileSync('accessibility_report.md', report, 'utf8');
console.info('Accessibility report generated.');
process.exit()
