# git

Install on Windows 10

Download Git for Windows directly from https://github.com/git-for-windows/git/releases/latest.
Run the installer program, follow the defaults (recommend other choices in the video, but defaults are ok too)
Open the Git Bash program, which is a Bash Shell terminal designed specifically for Git on Windows

Install on Linux

```console
sudo apt install git -y
git --version
```

Configure Git

Git requires your name and email address before any real work can be done. It is best to just configure Git from the start.

git config --global user.name "Your Name"
git config --global user.email "your.email@your-place.com"

### 15. Starting a Git Repo

```console
# Create a folder
mkdir Projects
cd Projects
# See the actual path
pwd

# Inicialization
git init demo
ls
cd demo/
ls -al
```


### 16. Git States

The Basic Workflow

Local                                 |    Remote
-----------------------------------------------------
Working     Staging   Repository      |
Directory   Area      (.git folder)   |

file.txt  > file.txt > file.txt >         file.txt

   

### 17. First commit

```bash
# nothing to commit
git status

# create a file using vs code editor and save
# Demo Project README
# This is a simple readme file
code README.md

# git status
# Untracked files: README.md

# Include in what will be committed
git add <file>
git add README.md

# See the file is on staging area
git status

# Commit
git commit -m "First file in demo repo"

# See the status, nothing to commit
git status
```

### 18. Repository and the Git Folder

```bash
pwd
# /c/Projects/demo

# git folder
cd .git/
ls -al
cd ..

# Remove git repository
rm -rf .git
git status
```

### 19. Starting with existing project
```
cd demo
git init .
ls -al
```

### 20. Commits and messages
```
# create new file
code LICENSE.md

# Add all files to git sataging area
git add .

# Vai abrir o seu editor selecionado no meu caso vs code, digite algo sobre a alteração, salve e feche.
git commit 
```

### 21. Commiti details with log and show

```
#See all commits
git log
git show
```

### Express commits

```
# Combine commands
# add, commit and message
git commit -am "Updateing README.md"
git log
```

### Backing out changes

```
git reset HEAD README.md
git checkout -- README.md
```

### History and making new commands with alias
```
git help log

# Better to see log
git log --oneline --graph --decorate  --all

# Config global
git config --global alias.hist "log --oneline --graph --decorate  --all"

# See all config
git config --global --list

# Test
git hist
```

### Rename and delete files
```
# create new file
code example.txt
git add example.txt
git commit example.txt -m "adding example file"

# rename
git mv example.txt demo.txt

# remove
git rm demo.txt
ls
git status
git commit -m "deleting demo file"
git status
```

### Managing files outside of git
```
git add -u
git add -A
```

### Excluding unwanted files
```
# log de uma aplicação
code application.log

# ignore the log
code .gitignore
# application.log or *.log 

```





# Create folder 
mkdir Code
cd Code
# Clone repository
git clone git clone https://github.com/BretFisher/udemy-docker-mastery.git
cd udemy-docker-mastery
# Check if have some updates compare your folder with the actual github folder
git pull

29. Comparing differences
```
git hist
git diff <id1> <id2>
```

30. Branching and Merge Types
- Branch = timeline of commits
- Branch names are labels, deletion removes label only
- Master Branch
- Feature Branch
- Types of merge: 
      - Fast-Formard: this happens in the simplest of cases, when no additional work has been detected on the parent branch, or in our case master. Git will simply apply all commits from the other branch directly onto the parent branch, as if we never branched off to begin with. Of course, we can disable the fast-forward merges if they are undesired for some reason.
      - Automatic: this happens when Git detects non-conflicting changes in the parent branch. Git is able to automatically resolve any conflicts. In doing so, the old branch's timeline is preserved, and a new merge commit is created to show the merging of the two branches.
      - Manual: this happens when Git is unable to automatically resolve any conflicts. Git enters a special conflicting merge state, which means that all merge conflicts must be resolved prior to moving forward with a commit. Once all conflicts have been resolved, those changes are saved as a merge commit.


31. Special Markers
HEAD
```

```

Calmamente...

### 32. Simple Branching Example
```
# git-branch - List, create, or delete branches
git branch

# git-checkout - Switch branches or restore working tree files
# Type "git checkout -b", for creating the branch; space;  and then the name of the branch you wish to create and switch to, I'm calling it "updates"; then press enter.
git checkout -b updates


```

33. Conflict Resolution
```

```

34. Marking Special Events with Tagging
```

```

35. Saving Work in Progress with Stashing
```

```

36. Time Travel with Reset and Reflog

