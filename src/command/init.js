// 命令管理
import commander from 'commander';
// 命令行交互工具
import inquirer from 'inquirer';
// 命令行中显示加载中
import ora from 'ora';
import Git from '../tools/git';

class Init {
  constructor() {
    this.git = new Git();
    this.commander = commander;
    this.inquirer = inquirer;
    this.getProList = ora('get project list...');
    this.getTagList = ora('get project version..');
    this.downLoad = ora('downloading...');
  }

  run() {
    this.commander
      .command('init')
      .description('downloading from remote...')
      .action(() => { this.download(); });

    this.commander.parse(process.argv);
  }

  async download() {
    let getProListLoad;
    let getTagListLoad;
    let downLoadLoad;
    let repos;
    let version;

    // 获取所在项目组的所有可开发项目列表
    try {
      getProListLoad = this.getProList.start();
      repos = await this.git.getProjectList();
      getProListLoad.succeed('get project list successful');
    } catch (error) {
      console.log(error);
      getProListLoad.fail('get project list failed...');
      process.exit(-1);
    }

    // 向用户咨询他想要开发的项目
    if (repos.length === 0) {
      console.log('\nthe number that you can develop is 0, config wrong\n'.red);
      process.exit(-1);
    }
    const choices = repos.map(({ name }) => name);
    const questions = [
      {
        type: 'list',
        name: 'repo',
        message: 'please choose the project type you want',
        choices,
      },
    ];
    const { repo } = await this.inquirer.prompt(questions);

    // 获取项目的版本, 这里默认选择确定项目的最近一个版本
    try {
      getTagListLoad = this.getTagList.start();
      [{ name: version }] = await this.git.getProjectVersions(repo);
      getTagListLoad.succeed('get project versin successful');
    } catch (error) {
      console.log(error);
      getTagListLoad.fail('get project versin failed...');
      process.exit(-1);
    }

    // 向用户咨询欲创建项目的目录
    const repoName = [
      {
        type: 'input',
        name: 'repoPath',
        message: 'please enter the project name',
        validate(v) {
          const done = this.async();
          if (!v.trim()) {
            done('the project name can not be empty');
          }
          done(null, true);
        },
      },
    ];
    const { repoPath } = await this.inquirer.prompt(repoName);

    // 下载代码到指定的目录下
    try {
      downLoadLoad = this.downLoad.start();
      await this.git.downloadProject({ repo, version, repoPath });
      downLoadLoad.succeed('download finished');
    } catch (error) {
      console.log(error);
      downLoadLoad.fail('download failed...');
    }
  }
}
const D = new Init();
D.run();
