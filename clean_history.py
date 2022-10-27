import os;

for (dirpath, dirnames, filenames) in os.walk(os.path.join(os.path.dirname(__file__), "history")):
	for filename in filenames:
		filepath = os.path.abspath(os.path.join(dirpath, filename));
		if filepath != os.path.abspath(__file__):
			os.remove(filepath);
		pass
	pass
pass
