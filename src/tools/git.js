import request from './request';
import { orgName } from '../../config';
import download from 'download-git-repo';

class Git {
  constructor() {
    this.orgName = orgName;
  }

  getProjectList() {
    return request(`/orgs/${this.orgName}/repos`);
  }

  getProjectVersions(repo) {
    return request(`/repos/${this.orgName}/${repo}/tags`);
  }

  getProjectUrl() {

  }

  downloadProject({ repo, version, repoPath }) {
    console.log(`${this.orgName}/${repo}#${version}----------->${repoPath}`)
    return new Promise((resolve, reject) => {
      download(`${this.orgName}/${repo}#${version}`, repoPath, (err) => {
        if (err) reject(err);
        resolve(true);
      });
    });
  }
}

export default Git;
